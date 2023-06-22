import { authDb } from 'src/lib/db'

export const comments = ({ postId }) => {
  return authDb().comment.findMany({ where: { postId } })
}

export const comment = ({ id }) => {
  return authDb().comment.findUnique({
    where: { id },
  })
}

export const createComment = ({ input }) => {
  return authDb().comment.create({
    data: input,
  })
}

export const deleteComment = ({ id }) => {
  return authDb().comment.delete({
    where: { id },
  })
}

export const Comment = {
  post: (_obj, { root }) => {
    return authDb().post.findUnique({ where: { id: root?.postId } })
  },
}
