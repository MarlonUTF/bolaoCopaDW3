import JogoRepository from './repository.js'
import JogoService from './service.js'
import JogoController from './controller.js'

export default async function (fastify, opts) {
  const repository = new JogoRepository()
  const service = new JogoService(repository)
  const controller = new JogoController(service)

  // Schema compartilhado para um jogo completo (inclui resultados)
  const jogoSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      numero_jogo: { type: 'integer' },
      fase: { type: 'string' },
      data_hora: { type: 'string' },
      estadio: { type: 'string' },
      encerrado: { type: 'boolean' },
      pais_casa_id: { type: 'integer', nullable: true },
      pais_fora_id: { type: 'integer', nullable: true },
      origem_casa_jogo_id: { type: 'integer', nullable: true },
      origem_fora_jogo_id: { type: 'integer', nullable: true },
      origem_casa_grupo_id: { type: 'integer', nullable: true },
      origem_casa_grupo_posicao: { type: 'integer', nullable: true },
      origem_fora_grupo_id: { type: 'integer', nullable: true },
      origem_fora_grupo_posicao: { type: 'integer', nullable: true },
      created_at: { type: 'string' },
      gols_casa: { type: 'integer', nullable: true },
      gols_fora: { type: 'integer', nullable: true },
      vencedor_id: { type: 'integer', nullable: true }
    }
  }

  // GET /jogos
  fastify.get('/', {
    schema: {
      tags: ['Jogos'],
      response: {
        200: {
          type: 'array',
          items: jogoSchema
        }
      }
    }
  }, controller.listar)

  // GET /jogos/:id
  fastify.get('/:id', {
    schema: {
      tags: ['Jogos'],
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } }
      },
      response: {
        200: jogoSchema
      }
    }
  }, controller.buscarPorId)

  // POST /jogos
  fastify.post('/', {
    schema: {
      tags: ['Jogos'],
      body: {
        type: 'object',
        required: ['numero_jogo', 'fase', 'data_hora'],
        properties: {
          numero_jogo: { type: 'integer' },
          fase: { type: 'string' },
          data_hora: { type: 'string' },
          estadio: { type: 'string' },
          encerrado: { type: 'boolean' },
          pais_casa_id: { type: 'integer', nullable: true },
          pais_fora_id: { type: 'integer', nullable: true },
          origem_casa_jogo_id: { type: 'integer', nullable: true },
          origem_fora_jogo_id: { type: 'integer', nullable: true },
          origem_casa_grupo_id: { type: 'integer', nullable: true },
          origem_casa_grupo_posicao: { type: 'integer', nullable: true },
          origem_fora_grupo_id: { type: 'integer', nullable: true },
          origem_fora_grupo_posicao: { type: 'integer', nullable: true }
        }
      },
      response: {
        201: jogoSchema
      }
    }
  }, controller.criar)

  // PUT /jogos/:id
  fastify.put('/:id', {
    schema: {
      tags: ['Jogos'],
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } }
      },
      body: {
        type: 'object',
        properties: {
          numero_jogo: { type: 'integer' },
          fase: { type: 'string' },
          data_hora: { type: 'string' },
          estadio: { type: 'string' },
          encerrado: { type: 'boolean' },
          pais_casa_id: { type: 'integer', nullable: true },
          pais_fora_id: { type: 'integer', nullable: true },
          origem_casa_jogo_id: { type: 'integer', nullable: true },
          origem_fora_jogo_id: { type: 'integer', nullable: true },
          origem_casa_grupo_id: { type: 'integer', nullable: true },
          origem_casa_grupo_posicao: { type: 'integer', nullable: true },
          origem_fora_grupo_id: { type: 'integer', nullable: true },
          origem_fora_grupo_posicao: { type: 'integer', nullable: true }
        }
      },
      response: {
        200: jogoSchema
      }
    }
  }, controller.atualizar)

  // DELETE /jogos/:id
  fastify.delete('/:id', {
    schema: {
      tags: ['Jogos'],
      params: {
        type: 'object',
        properties: { id: { type: 'integer' } }
      },
      response: {
        200: {
          type: 'object',
          properties: { mensagem: { type: 'string' } }
        }
      }
    }
  }, controller.remover)
}