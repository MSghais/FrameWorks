const sendAnalytics = async (body:any) => {
    let base_url="https://api.pinata.cloud/farcaster/frames/interactions"
    const options = { method: 'POST', headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` , body: JSON.stringify(body)} };

    // let url = `${baseUrl}?fid=${fid}&followers=true`
    // const usersRes = await fetch(base_url, options)
    const resInteractions = await fetch(base_url, options)
    const json = await resInteractions.json()
    console.log("json", json)
    return resInteractions

}


const getUsersFollowed = async (fid:number, fidToCheck:number ) => {
    const options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` } };
    let baseUrl = 'https://api.pinata.cloud/v3/farcaster/users'
    let url = `${baseUrl}?fid=${fid}&followers=true`
    const usersRes = await fetch(url, options)
    const json = await usersRes.json()
    console.log("users", json)
    const users = json?.data?.users as any[]
    return users
}


const getUsersFollowing = async (fid:number, fidToCheck:number ) => {
    const options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` } };
    let baseUrl = 'https://api.pinata.cloud/v3/farcaster/users'
    let url = `${baseUrl}?fid=${fid}&following=true`
    const usersRes = await fetch(url, options)
    const json = await usersRes.json()
    console.log("users", json)
    const users = json?.data?.users as any[]
    return users

}

