import AppError from '../../shared/AppError.js'
import pool from '../../database/pool.js'

class ResultadoService {
  constructor(resultadoRepository) {
    this.resultadoRepository = resultadoRepository
  }

  async listarTodos() {
    return await this.resultadoRepository.listarTodos()
  }

  async buscarPorId(id) {
    const resultado = await this.resultadoRepository.buscarPorId(id)
    if (!resultado) {
      throw new AppError('Resultado não encontrado', 404)
    }
    return resultado
  }

  async criarResultado(data) {
    const { jogo_id, vencedor_id } = data

    const jogoRes = await pool.query('SELECT id, encerrado FROM jogos WHERE id = $1', [jogo_id])
    if (jogoRes.rows.length === 0) {
      throw new AppError('Jogo não encontrado', 404)
    }

    const resultadoExistente = await this.resultadoRepository.buscarPorJogoId(jogo_id)
    if (resultadoExistente) {
      throw new AppError('Resultado já cadastrado para este jogo', 400)
    }

    const resultado = await this.resultadoRepository.criar(data)

    await pool.query('UPDATE jogos SET encerrado = TRUE WHERE id = $1', [jogo_id])

    if (vencedor_id) {
      await this._propagarChaveamento(jogo_id, vencedor_id)
    }

    return resultado
  }

  async atualizarResultado(id, data) {
    const resultado = await this.resultadoRepository.buscarPorId(id)
    if (!resultado) {
      throw new AppError('Resultado não encontrado', 404)
    }

    const resultadoAtualizado = await this.resultadoRepository.atualizar(id, data)

    if (data.vencedor_id !== undefined && data.vencedor_id !== resultado.vencedor_id) {
      await this._propagarChaveamento(resultado.jogo_id, data.vencedor_id)
    }

    return resultadoAtualizado
  }

  async removerResultado(id) {
    const resultado = await this.resultadoRepository.buscarPorId(id)
    if (!resultado) {
      throw new AppError('Resultado não encontrado', 404)
    }

    const removido = await this.resultadoRepository.remover(id)
    if (!removido) {
      throw new AppError('Falha ao remover resultado', 400)
    }

    await pool.query('UPDATE jogos SET encerrado = FALSE WHERE id = $1', [removido.jogo_id])

    return { mensagem: 'Resultado removido com sucesso' }
  }

  async _propagarChaveamento(jogo_origem_id, vencedor_id) {
    const jogosDestino = await pool.query(
      `SELECT id, origem_casa_jogo_id, origem_fora_jogo_id 
       FROM jogos 
       WHERE origem_casa_jogo_id = $1 OR origem_fora_jogo_id = $1`,
      [jogo_origem_id]
    )

    for (const jogo of jogosDestino.rows) {
      if (jogo.origem_casa_jogo_id === jogo_origem_id) {
        await pool.query('UPDATE jogos SET pais_casa_id = $1 WHERE id = $2', [vencedor_id, jogo.id])
      }
      if (jogo.origem_fora_jogo_id === jogo_origem_id) {
        await pool.query('UPDATE jogos SET pais_fora_id = $1 WHERE id = $2', [vencedor_id, jogo.id])
      }
    }
  }
}

export default ResultadoService