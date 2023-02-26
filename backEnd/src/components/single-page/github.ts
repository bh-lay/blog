
import { getGithubData } from '@/functions/my-github-data'

export default async function(template: string, data: any){
	const user_data = await getGithubData()
	return template.replace(/>>(\w+)<</g, function (a, key) {
		switch (key) {
		case 'public_repos':
			return user_data.public_repos
			break
		case 'followers':
			return user_data.followers
			break
		case 'following':
			return user_data.following
			break
		default:
			return '0'
		}
		return '0'
	})
}