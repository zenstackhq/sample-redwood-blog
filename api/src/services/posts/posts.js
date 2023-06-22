import { authDb, db } from 'src/lib/db'

export const posts = (...args) => {
  return authDb().post.findMany()
}

export const post = ({ id }) => {
  return authDb().post.findUnique({
    where: { id },
  })
}

export const Post = {
  user: (_obj, { root }) => db.user.findUnique({ where: { id: root.userId } }),
}
