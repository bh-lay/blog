/**
 * @author bh-lay
 */
import https from 'https'
import querystring from 'querystring'
import getAppConfig from '@/conf/app-config'

export function getAccessToken(code: string): Promise<string>{
	console.log('getAccessToken----------')
	const githubConfig = getAppConfig().github
	return new Promise((resolve, reject) => {
		const postData = querystring.stringify({
			client_id : githubConfig.clientId,
			client_secret : githubConfig.clientSecret,
			code : code,
			redirect_uri :githubConfig.redirectUri
		})
		// console.log('get token',postData);
		const request = https.request({
			hostname: 'github.com',
			port: 443,
			path: '/login/oauth/access_token',
			method: 'POST',
			headers: {
				'Content-Type' : 'application/x-www-form-urlencoded',
				'User-Agent' : 'L-plain-text',
				'Content-Length' : postData.length
			}
		}, function(resp) {
			let res_data = ''
			resp.on('data', function(d) {
				res_data += d
			}).on('end', function() {
				const res_json = querystring.parse(res_data)
				if(res_json.error){
					reject(res_json.error)
				} else {
					console.log('res_json', res_json)
					const token = res_json.token_type + ' ' + res_json.access_token
					resolve(token as string)
				}
			})
		})
		request.write(postData)
		request.end()
		request.on('error', function(error) {
			reject(error)
		})
	})
}

// User Info Sample
// {
//   login: 'bh-lay',
//   id: 4100462,
//   node_id: 'MDQ6VXNlcjQxMDA0NjI=',
//   avatar_url: 'https://avatars.githubusercontent.com/u/4100462?v=4',
//   gravatar_id: '',
//   url: 'https://api.github.com/users/bh-lay',
//   html_url: 'https://github.com/bh-lay',
//   followers_url: 'https://api.github.com/users/bh-lay/followers',
//   following_url: 'https://api.github.com/users/bh-lay/following{/other_user}',
//   gists_url: 'https://api.github.com/users/bh-lay/gists{/gist_id}',
//   starred_url: 'https://api.github.com/users/bh-lay/starred{/owner}{/repo}',
//   subscriptions_url: 'https://api.github.com/users/bh-lay/subscriptions',
//   organizations_url: 'https://api.github.com/users/bh-lay/orgs',
//   repos_url: 'https://api.github.com/users/bh-lay/repos',
//   events_url: 'https://api.github.com/users/bh-lay/events{/privacy}',
//   received_events_url: 'https://api.github.com/users/bh-lay/received_events',
//   type: 'User',
//   site_admin: false,
//   name: '剧中人',
//   company: 'Zoom Video Communications',
//   blog: 'http://bh-lay.com',
//   location: 'Hefei China',
//   email: 'mail@bh-lay.com',
//   hireable: null,
//   bio: '90后天蝎男，前端工程师，伪设计！',
//   twitter_username: null,
//   public_repos: 45,
//   public_gists: 14,
//   followers: 1007,
//   following: 99,
//   created_at: '2013-04-09T05:33:03Z',
//   updated_at: '2023-02-06T14:09:01Z'
// }
type userInfo = {
	login: string,
	id: number,
	name: string,
	email: string,
	avatar_url: string,
}
export function getUserInfoByToken (accessToken: string): Promise<userInfo>{
	return new Promise((resolve, reject) => {
		const request = https.request({
			hostname: 'api.github.com',
			port: 443,
			path: '/user',
			method: 'GET',
			headers: {
				Accept: 'application/vnd.github+json',
  			Authorization: accessToken,
				'User-Agent' : 'L-plain-text',
  			'X-GitHub-Api-Version': '2022-11-28'
			}
		}, function(resp) {
			let res_data = ''
			resp.on('data', function(d) {
				res_data += d
			}).on('end', function() {
				const res_json = JSON.parse(res_data)
				if (res_json.error) {
					reject(res_json.error)
				} else {
					resolve(res_json)
				}
			})
		})
		
		request.on('error', function(error) {
			reject(error)
		})
		
		request.end()
	})
}