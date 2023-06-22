import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Post/PostsCell'

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: Int!) {
    deletePost(id: $id) {
      id
    }
  }
`

const PUBLISH_POST_MUTATION = gql`
  mutation PublishPostMutation($id: Int!) {
    publishPost(id: $id) {
      id
    }
  }
`

const UNPUBLISH_POST_MUTATION = gql`
  mutation UnpublishPostMutation($id: Int!) {
    unpublishPost(id: $id) {
      id
    }
  }
`

const MAX_STRING_LENGTH = 150

const truncate = (text) => {
  let output = text
  if (text && text.length > MAX_STRING_LENGTH) {
    output = output.substring(0, MAX_STRING_LENGTH) + '...'
  }
  return output
}

const jsonTruncate = (obj) => {
  return truncate(JSON.stringify(obj, null, 2))
}

const timeTag = (datetime) => {
  return (
    <time dateTime={datetime} title={datetime}>
      {new Date(datetime).toUTCString()}
    </time>
  )
}

const checkboxInputTag = (checked) => {
  return <input type="checkbox" checked={checked} disabled />
}

const PostsList = ({ posts }) => {
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post deleted')
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const [publishPost] = useMutation(PUBLISH_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post published')
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const [unpublishPost] = useMutation(UNPUBLISH_POST_MUTATION, {
    onCompleted: () => {
      toast.success('Post unpublished')
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onPublishClick = (id) => {
    publishPost({ variables: { id } })
  }

  const onUnpublishClick = (id) => {
    unpublishPost({ variables: { id } })
  }

  const onDeleteClick = (id) => {
    if (confirm('Are you sure you want to delete post ' + id + '?')) {
      deletePost({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Body</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{truncate(post.id)}</td>
              <td>{truncate(post.title)}</td>
              <td>{truncate(post.body)}</td>
              <td>{timeTag(post.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.post({ id: post.id })}
                    title={'Show post ' + post.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editPost({ id: post.id })}
                    title={'Edit post ' + post.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  {post.published && (
                    <a
                      href="#"
                      title={'Unpublish post ' + post.id}
                      className="rw-button rw-button-small rw-button-red"
                      onClick={() => onUnpublishClick(post.id)}
                    >
                      Unpublish
                    </a>
                  )}
                  {!post.published && (
                    <a
                      href="#"
                      title={'Publish post ' + post.id}
                      className="rw-button rw-button-small rw-button-red"
                      onClick={() => onPublishClick(post.id)}
                    >
                      Publish
                    </a>
                  )}
                  <a
                    href="#"
                    title={'Delete post ' + post.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(post.id)}
                  >
                    Delete
                  </a>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PostsList
