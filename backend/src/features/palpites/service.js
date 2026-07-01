import AppError from '../../shared/AppError.js'

class PalpiteService {
  constructor(palpiteRepository, jogoRepository, bolaoRepository) {
    this.palpiteRepository = palpiteRepository
    this.jogoRepository = jogoRepository
    this.bolaoRepository = bolaoRepository
  }

  async listarTodos() {
    return await this.palpiteRepository.listarTodos()
  }

  async buscarPorId(id) {
    const palpite = await this.palpiteRepository.buscarPorId(id)
    if (!palpite) throw new AppError('Palpite não encontrado', 404)
    return palpite
  }

  async criarPalpite(palpite) {
    const { jogo_id, bolao_id, perfil_id } = palpite

    const jogo = await this.jogoRepository.buscarPorId(jogo_id)
    if (!jogo) throw new AppError('Jogo não encontrado', 404)
    if (jogo.encerrado) throw new AppError('Jogo já encerrado', 400)

    const participante = await this.bolaoRepository.buscarParticipante(bolao_id, perfil_id)
    if (!participante) throw new AppError('Perfil não participa deste bolão', 400)

    return await this.palpiteRepository.criar(palpite)
  }

  async atualizarPalpite(id, palpite) {
    const existente = await this.palpiteRepository.buscarPorId(id)
    if (!existente) throw new AppError('Palpite não encontrado', 404)

    const jogo = await this.jogoRepository.buscarPorId(existente.jogo_id)
    if (jogo.encerrado) throw new AppError('Jogo já encerrado', 400)

    return await this.palpiteRepository.atualizar(id, palpite)
  }

  async removerPalpite(id) {
    const existente = await this.palpiteRepository.buscarPorId(id)
    if (!existente) throw new AppError('Palpite não encontrado', 404)

    const jogo = await this.jogoRepository.buscarPorId(existente.jogo_id)
    if (jogo.encerrado) throw new AppError('Jogo já encerrado', 400)

    await this.palpiteRepository.remover(id)
  }
}

export default PalpiteService