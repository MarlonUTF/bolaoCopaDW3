import BolaoRepository from './repository.js'
import BolaoService from './service.js'
import BolaoController from './controller.js'
import errorSchema from '../../shared/errorSchema.js'

export default async function boloesRoutes(fastify, options) {
  const repository = new BolaoRepository()
  const service = new BolaoService(repository)
  const controller = new BolaoController(service)

  const bolaoSchema = {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      nome: { type: 'string' },
      descricao: { type: 'string' },
      criador_perfil_id: { type: 'integer' },
      criador_nome: { type: 'string' },
      created_at: { type: 'string' }
    }
  }

  fastify.get('/', {
    schema: {
      tags: ['Bolões'],
      response: { 200: { type: 'array', items: bolaoSchema } }
    }
  }, controller.listar)

  fastify.get('/:id', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: bolaoSchema,
        404: { description: 'Bolão não encontrado', ...errorSchema }
      }
    }
  }, controller.buscarPorId)

  fastify.post('/', {
    schema: {
      tags: ['Bolões'],
      body: {
        type: 'object',
        required: ['nome', 'criador_perfil_id'],
        properties: {
          nome: { type: 'string' },
          descricao: { type: 'string' },
          criador_perfil_id: { type: 'integer' }
        }
      },
      response: {
        201: bolaoSchema,
        400: { description: 'Erro de validação', ...errorSchema },
        404: { description: 'Perfil não encontrado', ...errorSchema }
      }
    }
  }, controller.criar)

  fastify.patch('/:id', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        properties: {
          nome: { type: 'string' },
          descricao: { type: 'string' }
        }
      },
      response: {
        200: bolaoSchema,
        404: { description: 'Bolão não encontrado', ...errorSchema }
      }
    }
  }, controller.atualizar)

  fastify.delete('/:id', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      response: {
        200: {
          type: 'object',
          properties: { mensagem: { type: 'string' } }
        },
        404: { description: 'Bolão não encontrado', ...errorSchema }
      }
    }
  }, controller.deletar)

  fastify.post('/:id/participantes', {
    schema: {
      tags: ['Bolões'],
      params: { type: 'object', properties: { id: { type: 'integer' } } },
      body: {
        type: 'object',
        required: ['perfil_id'],
        properties: { perfil_id: { type: 'integer' } }
      },
      response: {
        200: {
          type: 'object',
          properties: { mensagem: { type: 'string' } }
        },
        400: { description: 'Perfil já participa', ...errorSchema },
        404: { description: 'Bolão ou perfil não encontrado', ...errorSchema }
      }
    }
  }, controller.adicionarParticipante)
}