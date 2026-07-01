import ResultadoRepository from './repository.js'
import ResultadoService from './service.js'
import ResultadoController from './controller.js'
import errorSchema from '../../shared/errorSchema.js'

export default async function resultadosRoutes(fastify, options) {
  const repository = new ResultadoRepository()
  const service = new ResultadoService(repository)
  const controller = new ResultadoController(service)

  const resultadoSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      jogo_id: { type: 'integer' },
      gols_casa: { type: 'integer' },
      gols_fora: { type: 'integer' },
      vencedor_id: { type: 'integer', nullable: true },
      atualizado_em: { type: 'string' }
    }
  }

  fastify.get('/', {
    schema: {
      tags: ['Resultados'],
      response: {
        200: { type: 'array', items: resultadoSchema }
      }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Resultados'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: resultadoSchema,
        404: { description: 'Resultado não encontrado', ...errorSchema }
      }
    }
  }, controller.buscarPorId)

  fastify.post('/', {
    schema: {
      tags: ['Resultados'],
      body: {
        type: 'object',
        required: ['jogo_id', 'gols_casa', 'gols_fora'],
        properties: {
          jogo_id: { type: 'integer' },
          gols_casa: { type: 'integer' },
          gols_fora: { type: 'integer' },
          vencedor_id: { type: 'integer' }
        }
      },
      response: {
        201: resultadoSchema,
        400: { description: 'Erro de validação', ...errorSchema },
        404: { description: 'Jogo não encontrado', ...errorSchema }
      }
    }
  }, controller.criar)

  fastify.patch('/:id', {
    schema: {
      tags: ['Resultados'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        properties: {
          gols_casa: { type: 'integer' },
          gols_fora: { type: 'integer' },
          vencedor_id: { type: 'integer' }
        }
      },
      response: {
        200: resultadoSchema,
        404: { description: 'Resultado não encontrado', ...errorSchema }
      }
    }
  }, controller.atualizar)

  fastify.delete('/:id', {
    schema: {
      tags: ['Resultados'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: {
          type: 'object',
          properties: { mensagem: { type: 'string' } }
        },
        404: { description: 'Resultado não encontrado', ...errorSchema }
      }
    }
  }, controller.remover)
}