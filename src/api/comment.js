import fetch from '../axios/request'
/**
 * 评论 api
 */

const createComment = (data) => {
  return fetch({
      url: '/comment/comment',
      method: 'post',
      data
  })
}

const getCommentsList = (blogId, page, size) => {
  return fetch({
      url: `/comment/comment/${blogId}/${page}/${size}`,
      method: 'get'
  })
}

const favoriteComment = (id, type) => {
  return fetch({
    url: `/comment/comment/favorite`,
    method: 'post',
    data: {
      id,
      type
    }
  })
}


export {
    createComment,
    getCommentsList,
    favoriteComment
}