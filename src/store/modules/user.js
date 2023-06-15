import Vue from 'vue'
import { login, forgePassword, resetEditPassword, loginMobile, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, DICT_TYPE_TREE_DATA } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import { sysDictTypeTree } from '@/api/dictManage'
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    gxList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_GXLIST: (state, gxList) => {
      state.gxList = gxList
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        if (userInfo.customActiveKey === 'tab1') {
          login(userInfo).then(response => {
            if (response && response.code === 200) {
              const result = response.data
              Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000)
              commit('SET_TOKEN', result)
              resolve()
            } else {
              reject(new Error(response.message))
            }
          }).catch(error => {
            reject(error)
          })
        } else {
          loginMobile({ account: userInfo.mobile, code: userInfo.captcha }).then(response => {
            if (response && response.code === 200) {
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result)
            resolve()
          } else {
            reject(new Error(response.message))
          }
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 登录
    forgotPwd ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        forgePassword(userInfo).then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    resetEditPassword ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        resetEditPassword(userInfo).then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getInfo().then(response => {
          // eslint-disable-next-line prefer-const
          let result = response.data
          if (result.zhlx == '1') {
            // 显示订单1
            result.roleId = 'admin'
            result.role = roleObj1
            result.role.permissions.push({
              roleId: 'admin',
              permissionId: 'dd',
              permissionName: '订单2',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false
                }
              ],
              actionList: null,
              dataAccess: null
            })
          } else {
            // 显示订单2
            result.roleId = 'admin2'
            result.role = roleObj2
            result.role.permissions.push({
              roleId: 'admin2',
              permissionId: 'dd2',
              permissionName: '订单2',
              actions:
                '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"import","defaultCheck":false,"describe":"导入"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"},{"action":"export","defaultCheck":false,"describe":"导出"}]',
              actionEntitySet: [
                {
                  action: 'add',
                  describe: '新增',
                  defaultCheck: false
                },
                {
                  action: 'import',
                  describe: '导入',
                  defaultCheck: false
                },
                {
                  action: 'get',
                  describe: '详情',
                  defaultCheck: false
                },
                {
                  action: 'update',
                  describe: '修改',
                  defaultCheck: false
                },
                {
                  action: 'delete',
                  describe: '删除',
                  defaultCheck: false
                },
                {
                  action: 'export',
                  describe: '导出',
                  defaultCheck: false
                }
              ],
              actionList: null,
              dataAccess: null
            })
                      }
          if (result.role && result.role.permissions.length > 0) {
            const role = { ...result.role }
            role.permissions = result.role.permissions.map(permission => {
              const per = {
                ...permission,
                actionList: (permission.actionEntitySet || {}).map(item => item.action)
               }
              return per
            })
            console.info('role.permissions', role.permissions)
            role.permissionList = role.permissions.map(permission => { return permission.permissionId })
            // 覆盖响应体的 role, 供下游使用
            result.role = role

            commit('SET_ROLES', role)
            commit('SET_INFO', result)
            commit('SET_GXLIST', result.gxList)
            Vue.ls.set('gxList', result.gxList)
            commit('SET_NAME', { name: result.yhmc, welcome: welcome() })
            commit('SET_AVATAR', result.avatar)
            // 下游
            resolve(result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }
        }).catch(error => {
          console.info(error)
          reject(error)
        })
      })
    },
   // 加载所有字典数据
   dictTypeData () {
    return new Promise((resolve, reject) => {
      sysDictTypeTree().then((data) => {
        if (data.success) {
          const result = data.data
          Vue.ls.set(DICT_TYPE_TREE_DATA, result)
          resolve()
        } else {
          // eslint-disable-next-line no-undef
          reject(new Error(data.message))
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          Vue.ls.remove(ACCESS_TOKEN)
          resolve()
        }).catch((err) => {
          console.log('logout fail:', err)
          // resolve()
        }).finally(() => {
        })
      })
    }

  }
}

const roleObj1 = {
 id: 'admin',
 name: '管理员',
 describe: '拥有所有权限',
 status: 1,
 creatorId: 'system',
 createTime: 1497160610259,
 deleted: 0,
 permissions: [
   {
     roleId: 'admin',
     permissionId: 'dashboard',
     permissionName: '仪表盘',
     actions:
       '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
     actionEntitySet: [
       {
         action: 'add',
         describe: '新增',
         defaultCheck: false
       },
       {
         action: 'query',
         describe: '查询',
         defaultCheck: false
       },
       {
         action: 'get',
         describe: '详情',
         defaultCheck: false
       },
       {
         action: 'update',
         describe: '修改',
         defaultCheck: false
       },
       {
         action: 'delete',
         describe: '删除',
         defaultCheck: false
       }
     ],
     actionList: null,
     dataAccess: null
   },
   {
     roleId: 'admin',
     permissionId: 'exception',
     permissionName: '异常页面权限',
     actions:
       '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
     actionEntitySet: [
       {
         action: 'add',
         describe: '新增',
         defaultCheck: false
       },
       {
         action: 'query',
         describe: '查询',
         defaultCheck: false
       },
       {
         action: 'get',
         describe: '详情',
         defaultCheck: false
       },
       {
         action: 'update',
         describe: '修改',
         defaultCheck: false
       },
       {
         action: 'delete',
         describe: '删除',
         defaultCheck: false
       }
     ],
     actionList: null,
     dataAccess: null
   },
   {
     roleId: 'admin',
     permissionId: 'order',
     permissionName: '订单管理',
     actions:
       '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
     actionEntitySet: [
       {
         action: 'add',
         describe: '新增',
         defaultCheck: false
       },
       {
         action: 'query',
         describe: '查询',
         defaultCheck: false
       },
       {
         action: 'get',
         describe: '详情',
         defaultCheck: false
       },
       {
         action: 'update',
         describe: '修改',
         defaultCheck: false
       },
       {
         action: 'delete',
         describe: '删除',
         defaultCheck: false
       }
     ],
     actionList: null,
     dataAccess: null
   }
 ]
}
const roleObj2 = {
 id: 'admin2',
 name: '管理员',
 describe: '拥有所有权限',
 status: 1,
 creatorId: 'system',
 createTime: 1497160610259,
 deleted: 0,
 permissions: [
   {
     roleId: 'admin2',
     permissionId: 'dashboard',
     permissionName: '仪表盘',
     actions:
       '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
     actionEntitySet: [
       {
         action: 'add',
         describe: '新增',
         defaultCheck: false
       },
       {
         action: 'query',
         describe: '查询',
         defaultCheck: false
       },
       {
         action: 'get',
         describe: '详情',
         defaultCheck: false
       },
       {
         action: 'update',
         describe: '修改',
         defaultCheck: false
       },
       {
         action: 'delete',
         describe: '删除',
         defaultCheck: false
       }
     ],
     actionList: null,
     dataAccess: null
   },
   {
     roleId: 'admin2',
     permissionId: 'exception',
     permissionName: '异常页面权限',
     actions:
       '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
     actionEntitySet: [
       {
         action: 'add',
         describe: '新增',
         defaultCheck: false
       },
       {
         action: 'query',
         describe: '查询',
         defaultCheck: false
       },
       {
         action: 'get',
         describe: '详情',
         defaultCheck: false
       },
       {
         action: 'update',
         describe: '修改',
         defaultCheck: false
       },
       {
         action: 'delete',
         describe: '删除',
         defaultCheck: false
       }
     ],
     actionList: null,
     dataAccess: null
   },
   {
     roleId: 'admin2',
     permissionId: 'order',
     permissionName: '订单管理',
     actions:
       '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
     actionEntitySet: [
       {
         action: 'add',
         describe: '新增',
         defaultCheck: false
       },
       {
         action: 'query',
         describe: '查询',
         defaultCheck: false
       },
       {
         action: 'get',
         describe: '详情',
         defaultCheck: false
       },
       {
         action: 'update',
         describe: '修改',
         defaultCheck: false
       },
       {
         action: 'delete',
         describe: '删除',
         defaultCheck: false
       }
     ],
     actionList: null,
     dataAccess: null
   }
 ]
}
export default user
