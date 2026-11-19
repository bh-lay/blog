# API：批量删除评论

一次性按评论 ID 列表删除多条评论。适用于管理后台的评论批量管理场景。

单条删除请继续使用：`DELETE /api/comments/:id`（本接口不受其影响，两者可并存）。

---

## 1. 接口定义

| 项目 | 说明 |
| --- | --- |
| 请求方法 | `DELETE` |
| 路径 | `/api/comments` |
| Content-Type | `application/json`（必填，否则请求体无法被正确解析） |
| 鉴权 | 需携带已登录的会话 Cookie `session_verify`，且该会话具备 `COMMENTS_DELETE` 权限 |
| 响应格式 | JSON（响应体经 gzip 压缩，由 HTTP 客户端自动处理） |

> 路径说明：本接口使用集合路径 `/api/comments`（不带 `:id`），因此不会被单条删除路由 `DELETE /api/comments/:id` 拦截，请勿在末尾追加 ID 或其他路径段。

## 2. 请求参数

请求体为 JSON 对象：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `ids` | string[] | 是 | 待删除评论的 `_id` 列表，每个值必须是合法的 24 位十六进制 MongoDB ObjectId。非空数组，单次最多 500 个；重复 ID 会自动去重。 |

请求体示例：

```json
{
  "ids": [
    "65a1b2c3d4e5f60718293a4b",
    "65a1b2c3d4e5f60718293a4c"
  ]
}
```

## 3. 响应

所有响应 HTTP 状态码均为 `200`，业务结果通过响应体的 `code` 字段区分：

| `code` | 含义 | 附加字段 |
| --- | --- | --- |
| `200` | 删除成功 | `requested`：去重后实际尝试删除的 ID 数量；`deleted`：数据库实际删除的条数（ID 不存在则不计入） |
| `201` | 无权限（未登录或会话不具备 `COMMENTS_DELETE` 权限） | 无 |
| `400` | 参数错误（`ids` 非数组 / 空数组 / 超过 500 / 含非法 ObjectId） | `msg`：错误原因 |

成功响应：

```json
{
  "code": 200,
  "requested": 2,
  "deleted": 2
}
```

> 注意：`deleted` 可能小于 `requested`（例如部分评论已被他人删除）。这属于正常情况，请以 `code` 判断接口是否成功，而不是比较两者是否相等。

无权限响应：

```json
{ "code": 201 }
```

参数错误响应：

```json
{ "code": 400, "msg": "invalid comment id : xxx" }
```

## 4. 调用示例

### curl

```bash
curl -X DELETE 'https://你的域名/api/comments' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: session_verify=<已登录会话的 cookie 值>' \
  -d '{"ids":["65a1b2c3d4e5f60718293a4b","65a1b2c3d4e5f60718293a4c"]}'
```

### JavaScript（fetch）

```js
async function batchDeleteComments(ids) {
  const res = await fetch('/api/comments', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin', // 跨域时改为 'include'，确保携带 session cookie
    body: JSON.stringify({ ids }),
  })
  return await res.json()
}

// { code: 200, requested: 2, deleted: 2 }
const result = await batchDeleteComments([
  '65a1b2c3d4e5f60718293a4b',
  '65a1b2c3d4e5f60718293a4c',
])
```

### axios

```js
import axios from 'axios'

const { data } = await axios.delete('/api/comments', {
  data: { ids: ['65a1b2c3d4e5f60718293a4b'] },
  withCredentials: true,
})
// data = { code: 200, requested: 1, deleted: 1 }
```

> axios 删除请求体要放在 `config.data` 中（第二个参数），不是放在 `axios.delete(url, body)`。

## 5. 注意事项

1. **必须设置 `Content-Type: application/json`**：服务端据此解析请求体；使用其他类型（如直接 `form-data`）将无法解析出 `ids`，从而返回 `400`。
2. **ID 格式**：必须是 MongoDB 的 `_id`（24 位十六进制字符串），不是业务上的 `cid` 或自增 ID。评论列表接口返回数据中的 `_id` 字段即为所需值。
3. **批量上限**：单次最多 500 个 ID，超出请分批调用。
4. **全量校验**：只要有一个 ID 非法，整批请求会被拒绝（`400`），不会执行任何删除。调用前请自行保证 ID 来源可靠。
5. **缓存**：删除成功后服务端会自动清除评论缓存，无需额外调用清缓存接口。
6. **权限**：本接口与单条删除共用 `COMMENTS_DELETE` 权限；会话登录后需具备该权限位方可调用。
