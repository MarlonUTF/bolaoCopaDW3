import JogoRepository from './repository.js'
import JogoService from './service.js'
import JogoController from './controller.js'
import errorSchema from '../../shared/errorSchema.js'

export default async function jogosRoutes(fastify, opts) {
  const repository = new JogoRepository()
  const service = new JogoService(repository)
  const controller = new JogoController(service)

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

  fastify.get('/', {
    schema: {
      tags: ['Jogos'],
      response: {
        200: { type: 'array', items: jogoSchema }
      }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Jogos'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: jogoSchema,
        404: { description: 'Jogo não encontrado', ...errorSchema }
      }
    }
  }, controller.buscarPorId)

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
        201: jogoSchema,
        400: { description: 'Erro de validação', ...errorSchema }
      }
    }
  }, controller.criar)

  fastify.patch('/:id', {
    schema: {
      tags: ['Jogos'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
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
        200: jogoSchema,
        404: { description: 'Jogo não encontrado', ...errorSchema }
      }
    }
  }, controller.atualizar)

  fastify.delete('/:id', {
    schema: {
      tags: ['Jogos'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: {
          type: 'object',
          properties: { mensagem: { type: 'string' } }
        },
        400: { description: 'Jogo encerrado', ...errorSchema },
        404: { description: 'Jogo não encontrado', ...errorSchema }
      }
    }
  }, controller.remover)
}