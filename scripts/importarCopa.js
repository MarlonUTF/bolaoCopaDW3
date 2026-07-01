// scripts/importarCopa.js
import pool from '../src/database/pool.js'

const TEAMS_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams'
const SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719'

// ============================================================
// 0. Ajustes de schema (permitir 3º colocados)
// ============================================================
async function ajustarConstraints() {
  await pool.query(`
    ALTER TABLE jogos DROP CONSTRAINT IF EXISTS ck_grupo_posicao_casa;
    ALTER TABLE jogos DROP CONSTRAINT IF EXISTS ck_grupo_posicao_fora;

    ALTER TABLE jogos
      ADD CONSTRAINT ck_grupo_posicao_casa CHECK (origem_casa_grupo_posicao IN (1,2,3));

    ALTER TABLE jogos
      ADD CONSTRAINT ck_grupo_posicao_fora CHECK (origem_fora_grupo_posicao IN (1,2,3));
  `)
  console.log('✅ Constraints ajustadas para permitir 3º colocados')
}

// ============================================================
// 1. Importar grupos (A‑L) e países
// ============================================================
async function importarGruposEPaises() {
  console.log('🔄 Criando grupos e importando seleções...')

  const letras = ['A','B','C','D','E','F','G','H','I','J','K','L']
  const grupoParaId = {}
  for (const nome of letras) {
    const { rows } = await pool.query(
      'INSERT INTO grupos (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome=$1 RETURNING id',
      [nome]
    )
    grupoParaId[nome] = rows[0].id
    console.log(`  ✅ Grupo ${nome} (id=${rows[0].id})`)
  }

  const res = await fetch(TEAMS_URL)
  const data = await res.json()
  const teams = data?.sports?.[0]?.leagues?.[0]?.teams
  if (!teams) throw new Error('Estrutura inesperada em /teams')

  let contador = 0
  for (const t of teams) {
    const { displayName, abbreviation, logos, groups } = t.team || {}
    if (!displayName || !abbreviation) continue

    const grupoNome = groups?.[0] || null
    const grupoId = grupoNome ? grupoParaId[grupoNome] : null
    const bandeiraUrl = logos?.[0]?.href || null

    await pool.query(
      `INSERT INTO paises (nome, sigla_fifa, bandeira_url, grupo_id)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (sigla_fifa) DO UPDATE
       SET nome=$1, bandeira_url=$3, grupo_id=$4`,
      [displayName, abbreviation.toUpperCase(), bandeiraUrl, grupoId]
    )
    contador++
  }
  console.log(`  ✅ ${contador} países importados/atualizados`)
}

// ============================================================
// 2. Importar jogos + resultados (apenas dados reais da API)
// ============================================================
async function importarJogosEResultados() {
  console.log('🔄 Buscando jogos da Copa...')

  const res = await fetch(SCOREBOARD_URL)
  const data = await res.json()
  const events = data?.events
  if (!events || !Array.isArray(events)) throw new Error('Nenhum evento encontrado')

  let inseridos = 0
  let resultadosInseridos = 0

  for (const evt of events) {
    const comp = evt.competitions?.[0]
    if (!comp) continue

    const homeCompetitor = comp.competitors?.find(c => c.homeAway === 'home')
    const awayCompetitor = comp.competitors?.find(c => c.homeAway === 'away')
    const encerrado = evt.status?.type?.completed === true ||
                      evt.status?.type?.name === 'STATUS_FINAL' ||
                      evt.status?.type?.name === 'STATUS_FULL_TIME'

    // Extrai fase prioritariamente do campo altGameNote ou slug
    const fase = extrairFaseDoEvento(evt)

    // Interpreta o nome do evento para obter times e origens de chaveamento
    const nomeEvento = evt.shortName || evt.name || ''
    const info = await interpretarNomeEvento(nomeEvento)

    // Combina: se o interpretador não encontrou times, usa os competitors da API
    let paisCasaId = info.paisCasaId
    let paisForaId = info.paisForaId
    if (!paisCasaId && homeCompetitor?.team?.displayName) {
      paisCasaId = await buscarPaisIdPorNome(homeCompetitor.team.displayName)
    }
    if (!paisForaId && awayCompetitor?.team?.displayName) {
      paisForaId = await buscarPaisIdPorNome(awayCompetitor.team.displayName)
    }

    const dataHora = evt.date
    const estadio = comp.venue?.fullName || null
    const numeroJogo = parseInt(evt.id)

    // Insere ou atualiza o jogo
    await pool.query(
      `INSERT INTO jogos (
        numero_jogo, fase, data_hora, estadio, encerrado,
        pais_casa_id, pais_fora_id,
        origem_casa_jogo_id, origem_fora_jogo_id,
        origem_casa_grupo_id, origem_casa_grupo_posicao,
        origem_fora_grupo_id, origem_fora_grupo_posicao
      ) VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,
        $8,$9,
        $10,$11,
        $12,$13
      )
      ON CONFLICT (numero_jogo) DO UPDATE SET
        fase = EXCLUDED.fase,
        data_hora = EXCLUDED.data_hora,
        estadio = EXCLUDED.estadio,
        encerrado = EXCLUDED.encerrado,
        pais_casa_id = EXCLUDED.pais_casa_id,
        pais_fora_id = EXCLUDED.pais_fora_id,
        origem_casa_jogo_id = EXCLUDED.origem_casa_jogo_id,
        origem_fora_jogo_id = EXCLUDED.origem_fora_jogo_id,
        origem_casa_grupo_id = EXCLUDED.origem_casa_grupo_id,
        origem_casa_grupo_posicao = EXCLUDED.origem_casa_grupo_posicao,
        origem_fora_grupo_id = EXCLUDED.origem_fora_grupo_id,
        origem_fora_grupo_posicao = EXCLUDED.origem_fora_grupo_posicao
      `,
      [
        numeroJogo, fase, dataHora, estadio, encerrado,
        paisCasaId, paisForaId,
        info.origCasaJogoId, info.origForaJogoId,
        info.origCasaGrupoId, info.origCasaPos,
        info.origForaGrupoId, info.origForaPos
      ]
    )
    inseridos++

    // Resultados (apenas se houver placar)
    if (encerrado && homeCompetitor && awayCompetitor) {
      const golsCasa = extrairPlacar(homeCompetitor)
      const golsFora = extrairPlacar(awayCompetitor)
      if (golsCasa !== null && golsFora !== null) {
        let vencedorId = null
        if (golsCasa > golsFora) vencedorId = paisCasaId
        else if (golsFora > golsCasa) vencedorId = paisForaId

        await pool.query(
          `INSERT INTO resultados (jogo_id, gols_casa, gols_fora, vencedor_id)
           VALUES ((SELECT id FROM jogos WHERE numero_jogo=$1), $2, $3, $4)
           ON CONFLICT (jogo_id) DO UPDATE
           SET gols_casa=$2, gols_fora=$3, vencedor_id=$4, atualizado_em=now()`,
          [numeroJogo, golsCasa, golsFora, vencedorId]
        )
        resultadosInseridos++
      }
    }
  }

  console.log(`  ✅ ${inseridos} jogos importados/atualizados`)
  console.log(`  ✅ ${resultadosInseridos} resultados inseridos/atualizados`)
}

// ============================================================
// Extrai a fase do evento usando altGameNote e season.slug
// ============================================================
function extrairFaseDoEvento(evt) {
  const altNote = evt.competitions?.[0]?.altGameNote || ''
  const match = altNote.match(/, ([^,]+)$/)
  if (match) return mapearFase(match[1].trim())

  if (evt.season?.slug) {
    const nome = evt.season.slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return mapearFase(nome)
  }

  // fallback final
  return 'Grupos'
}

// ============================================================
// Interpretação do nome do evento (chaveamento)
// ============================================================
async function interpretarNomeEvento(nome) {
  if (!nome) return {}

  nome = nome.trim()

  const grupoPosRegex = /([123])(?:st|nd|rd|th)?\s*(?:Group\s*)?([A-L])/i
  const winnerRegex = /(?:Winner|W)\s*(?:Match\s*)?(\d+)/i
  const atSignRegex = /^(.+)\s+@\s+(.+)$/i

  const partes = nome.split(/\s+vs\.?\s+/i)
  if (partes.length !== 2) {
    const matchAt = nome.match(atSignRegex)
    if (matchAt) {
      const awayName = matchAt[1].trim()
      const homeName = matchAt[2].trim()
      const paisCasaId = await buscarPaisIdPorNome(homeName)
      const paisForaId = await buscarPaisIdPorNome(awayName)
      return { paisCasaId, paisForaId }
    }
    // fallback: nome de time puro
    const paisCasaId = await buscarPaisIdPorNome(nome)
    return { paisCasaId, paisForaId: null }
  }

  const [ladoCasa, ladoFora] = partes

  // Padrão "Winner X"
  const origCasaJogoMatch = ladoCasa.match(winnerRegex)
  const origForaJogoMatch = ladoFora.match(winnerRegex)
  if (origCasaJogoMatch || origForaJogoMatch) {
    const origCasaJogoId = origCasaJogoMatch ? parseInt(origCasaJogoMatch[1]) : null
    const origForaJogoId = origForaJogoMatch ? parseInt(origForaJogoMatch[1]) : null
    return { origCasaJogoId, origForaJogoId }
  }

  // Padrão "1A"
  const gpCasa = ladoCasa.match(grupoPosRegex)
  const gpFora = ladoFora.match(grupoPosRegex)
  if (gpCasa && gpFora) {
    const posCasa = parseInt(gpCasa[1])
    const posFora = parseInt(gpFora[1])
    const grupoCasaId = await buscarGrupoIdPorNome(gpCasa[2].toUpperCase())
    const grupoForaId = await buscarGrupoIdPorNome(gpFora[2].toUpperCase())
    return {
      origCasaGrupoId: grupoCasaId,
      origCasaPos: posCasa,
      origForaGrupoId: grupoForaId,
      origForaPos: posFora
    }
  }

  // Nomes de times (ex: "Brazil vs Germany")
  const paisCasaId = await buscarPaisIdPorNome(ladoCasa.trim())
  const paisForaId = await buscarPaisIdPorNome(ladoFora.trim())
  return { paisCasaId, paisForaId }
}

// ============================================================
// Helpers
// ============================================================
function mapearFase(nome) {
  if (!nome) return null
  const n = nome.toLowerCase()
  if (n.includes('group')) return 'Grupos'
  if (n.includes('round of 32') || n.includes('round of thirty-two')) return 'Dezesseis avos'
  if (n.includes('round of 16') || n.includes('rd of 16')) return 'Oitavas'
  if (n.includes('quarter')) return 'Quartas'
  if (n.includes('semi')) return 'Semifinal'
  if (n.includes('third')) return 'Terceiro Lugar'
  if (n.includes('final')) return 'Final'
  return 'Grupos'   // fallback seguro
}

function extrairPlacar(competitor) {
  if (!competitor?.score) return null
  const score = competitor.score
  if (typeof score === 'string') return parseInt(score, 10)
  if (typeof score === 'object' && score.value !== undefined) return parseInt(score.value, 10)
  return null
}

const ALIASES = {
  'usa': 'United States',
  'united states of america': 'United States',
  'korea republic': 'South Korea',
  'south korea': 'South Korea',
  'ir iran': 'Iran',
  'czech republic': 'Czechia',
  'czechia': 'Czechia',
  'democratic republic of the congo': 'DR Congo',
  'dr congo': 'DR Congo',
  'congo': 'DR Congo',
  'north korea': 'Korea DPR',
  'korea dpr': 'Korea DPR',
  'ivory coast': "Côte d'Ivoire",
  "côte d'ivoire": "Côte d'Ivoire",
  'cape verde': 'Cape Verde Islands',
  'cape verde islands': 'Cape Verde Islands',
}

async function buscarPaisIdPorNome(nome) {
  if (!nome) return null
  const nomeLower = nome.toLowerCase().trim()
  const nomeCorrigido = ALIASES[nomeLower] || nome

  const { rows } = await pool.query(
    `SELECT id FROM paises
     WHERE LOWER(nome) = LOWER($1)
        OR LOWER(sigla_fifa) = LOWER($1)`,
    [nomeCorrigido]
  )
  return rows[0]?.id || null
}

async function buscarGrupoIdPorNome(nome) {
  if (!nome) return null
  const { rows } = await pool.query('SELECT id FROM grupos WHERE nome = $1', [nome.toUpperCase()])
  return rows[0]?.id || null
}

// ============================================================
// Execução principal
// ============================================================
async function main() {
  try {
    console.log('🚀 Iniciando importação da Copa do Mundo...\n')
    await ajustarConstraints()
    console.log('')
    await importarGruposEPaises()
    console.log('')
    await importarJogosEResultados()
    console.log('\n🎉 Importação concluída!')
    await pool.end()
  } catch (err) {
    console.error('❌ Erro:', err.message)
    await pool.end()
    process.exit(1)
  }
}

main()