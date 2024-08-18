import {
    fetchDelete,
    fetchGet,
    fetchPatch,
    fetchPost,
    fetchPostForm,
    fetchPut,
} from 'ce-utils'

export default {
    get: fetchGet,
    post: fetchPost,
    postForm: fetchPostForm,
    put: fetchPut,
    delete: fetchDelete,
    patch: fetchPatch,
}
