import request from 'request'

const clientUserAgent = 'bh-lay github api robots'

// 从Github API获取数据
export function getRepoInfo (repoName: string) {
  return new Promise((resolve, reject) => {
    repoName = repoName.replace(/^\//,'')
    request({
      url: 'https://api.github.com/repos/' + repoName,
      headers: {
        'User-Agent': clientUserAgent
      }
    }, function (err, response, body) {
      let responseBody
      if (err || response.statusCode !== 200) {
        return reject(new Error('error'))
      }
      try {
        responseBody = JSON.parse( body || {} )
        resolve(responseBody)
      } catch (e) {
        reject(e)
      }
    })
  })
}

// 从Github API获取数据
export type githubUserInfo = {
	public_repos: string,
	followers: string,
	following: string
}
export function getUserInfo (username: string): Promise<githubUserInfo> {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://api.github.com/users/' + username,
      headers: {
        'User-Agent': clientUserAgent
      }
    }, function (err, response, body) {
      response = response || {}
      let responseBody
      if (err || response.statusCode !== 200) {
        return reject(new Error('error'))
      }
      try {
        responseBody = JSON.parse( body || {} )
        resolve({
          public_repos: responseBody.public_repos || '0',
          followers: responseBody.followers || '0',
          following: responseBody.following || '0'
        })
      } catch (e) {
        reject(e)
      }
    })
  })
}
