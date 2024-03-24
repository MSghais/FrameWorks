export const sendAnalytics = async (body: any) => {
  let base_url = "https://api.pinata.cloud/farcaster/frames/interactions";
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_TOKEN}`,
      body: JSON.stringify(body),
    },
  };

  // let url = `${baseUrl}?fid=${fid}&followers=true`
  // const usersRes = await fetch(base_url, options)
  const resInteractions = await fetch(base_url, options);
  const json = await resInteractions.json();
  console.log("json", json);
  return resInteractions;
};

export const getUsersFollowed = async (fid: number, fidToCheck?: number) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let url = `${baseUrl}?fid=${fid}&followers=true`;
  const usersRes = await fetch(url, options);
  const json = await usersRes.json();
  console.log("users", json);
  const users = json?.data?.users as any[];
  return users;
};

export const getUsersFollowing = async (fid: number, fidToCheck?: number) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let url = `${baseUrl}?fid=${fid}&following=true`;
  const usersRes = await fetch(url, options);
  const json = await usersRes.json();
  console.log("users", json);
  const users = json?.data?.users as any[];
  return users;
};

export const getUserByFid = async (
  fid: number | string,
  fidToCheck?: number
) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/users";
  let url = `${baseUrl}/${fid}`;
  const userRes = await fetch(url, options);
  const json = await userRes.json();
  console.log("users", json);
  const user = json?.data as any;
  return user;
};

export const getCastByHash = async (hash: string, fidToCheck?: number) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  // let baseUrl = 'https://api.pinata.cloud/v3/farcaster/casts'
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/casts";
  // let url = `${baseUrl}`
  let url = `${baseUrl}?parentHash=${hash}`;
  const castRes = await fetch(url, options);
  const json = await castRes.json();
  console.log("cast json", json);
  //   const cast = json?.data as any;
  const cast = json?.data?.casts[0] as any;

  return cast;
};

export const getCastByUserFid = async (fid: string, fidToCheck?: number) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/casts";
  let url = `${baseUrl}?fid=${fid}`;
  const castRes = await fetch(url, options);
  const json = await castRes.json();
  console.log("cast json", json);
  const cast = json?.data as any;
  return cast;
};

export const getCastsByFollowing = async (fid: string) => {
    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
    };
    let baseUrl = "https://api.pinata.cloud/v3/farcaster/casts";
    let url = `${baseUrl}?fid=${fid}&following=true`;
    const castRes = await fetch(url, options);
    const json = await castRes.json();
    console.log("cast json", json);
    const cast = json?.data?.casts as any;
    return cast;
  };

export const getChannelByName = async (name: string, fidToCheck?: number) => {
  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_TOKEN}` },
  };
  let baseUrl = "https://api.pinata.cloud/v3/farcaster/channels";
  //   let url = `${baseUrl}/${name}`;
  let url = `https://api.pinata.cloud/v3/farcaster/channels/gm`;

  console.log("url pinate channel", url);
  const channelRes = await fetch(url, options);
  const json = await channelRes.json();
  console.log("channel json", json);
  const channel = json?.data as any;
  return channel;
};
