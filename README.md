# Redwood Tutorial App

This project demonstrates how to use [ZenStack](https://zenstack.dev) in a RedwoodJS project. It's extended based on the blog app used through [RedwoodJS's tutorial](https://redwoodjs.com/docs/tutorial/foreword).

Please refer to [this blog post](https://zenstack.dev/blog/redwood-auth) for a general introduction.

---

## Steps to get started with ZenStack

1. Prepare project

    Install CLI

    ```bash
    cd api
    yarn add -D zenstack
    yarn add @zenstackhq/runtime
    ```

    Bootstrap ZModel from `schema.prisma`

    ```bash
    cp db/schema.prisma ./schema.zmodel
    ```

1. Prepare model

    Add the following section to `schema.zmodel` to output the generated Prisma schema to the default location of Redwood:

    ```
    plugin prisma {
      provider = '@core/prisma'
      output = './db/schema.prisma'
    }
    ```

    Run `zenstack generate` and verify that `db/schema.prisma` is updated.

    ```bash
    yarn zenstack generate
    ```

1. Add access policies

    Note the added `@@allow` rules (all operations are denied by default).

    ```prisma
    model Post {
      id        Int      @id @default(autoincrement())
      title     String
      body      String
      comments  Comment[]
      user      User     @relation(fields: [userId], references: [id])
      userId    Int
      createdAt DateTime @default(now())
      published Boolean @default(true)
    
      // 🔐 Admin user can do everything to his own posts
      @@allow('all', auth().roles == 'admin' && auth() == user)
    
      // 🔐 Posts are visible to everyone if published
      @@allow('read', published)
    }

    model Comment {
      id        Int      @id @default(autoincrement())
      name      String
      body      String
      post      Post     @relation(fields: [postId], references: [id])
      postId    Int
      createdAt DateTime @default(now())
    
      // 🔐 Moderator user can do everything to comments
      @@allow('all', auth().roles == 'moderator')
    
      // 🔐 Everyone is allowed to view and create comments for published posts
      @@allow('create,read', post.published)
    }

    ```

    See the next section for where the `auth()` function's value comes from.

    Rerun generation and migrate the database.

    ```bash
    yarn zenstack generate
    yarn rw prisma migrate dev
    ```

1. Create access-policy-enhanced Prisma Client

    Add the following function to `api/src/lib/db.js`:

    ```js
    import { withPolicy } from '@zenstackhq/runtime'

    /*
     * Returns ZenStack wrapped Prisma Client with access policies enabled.
     */
    export function authDb() {
      return withPolicy(db, { user: context.currentUser })
    }
    ```

    It uses the `withPolicy` API to create a Prisma Client wrapper (note the `context.currentUser` is passed in as the current user, which determines what the `auth()` function returns in the ZModel policy rules).

1. Switch to relying on access policies for authorization

    For example, remove authorization from `api/src/services/comments.js` and use `authDb()` helper to access db.

    ```diff
    export const deleteComment = ({ id }) => {
    -   requireAuth({ roles: 'moderator' })
    -   return db.comment.delete({ where: { id } })
        return authDb().comment.delete({ where: { id } })
    }
    ```
