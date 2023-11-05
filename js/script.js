
const API_KEY  = "AIzaSyAUG7EyS8sRbezBj2C0I1K1L7EeGcuTrq8";

const BASE_URL = "https://www.googleapis.com/youtube/v3";


window.addEventListener("load", loadVideosOntoHomePage);

const videoGalary = document.getElementById("video-galary");


async function loadVideosOntoHomePage(){
        const endPoint = `${BASE_URL}/videos?part=snippet&chart=mostPopular&regionCode=IN&key=${API_KEY}&maxResults=20`;  
        const responce = await fetch(endPoint);
        const result = await responce.json();
        const videoArr = result.items;
        console.log(videoArr);
        videoArr.forEach(async(videoData) => {
                const videoId = videoData.id;
                // const channelId = videoData.snippet.channelId;
                // const channelTitle = videoData.snippet.channelTitle;

                // const thumbnailUrl = videoData.snippet.thumbnails.default.url;
                // const videoTitle = videoData.snippet.thumbnails.title;


                const { viewCount, likeCount } = await getVideoStats(videoId);
                const {channelLogo, subscriberCount} = await getChannelDetails(channelId);
                videoData.snippet.channelLogo = channelLogo;
                videoData.snippet.subscriberCount = subscriberCount;

                videoData.snippet.viewCount = viewCount;
                videoData.snippet.likeCount = likeCount;
        })
        renderDataOnHomePage(videoArr);
}


function renderDataOnHomePage(videoArr){
        videoArr.forEach((video)=>{
                const card = document.createElement("div");
                card.className = "video-card";
                card.innerHTML = `
                <div id="thumbnail">
                        <img src="${video.snippet.thumbnails.medium.url}" alt="" style="width: 400px; display: block;">
                        <p class="duration">4:26</p>
                </div>
                <div id="description">
                        <div id="channelLogo"><img src="${video.snippet.channelLogo}" alt="" style="width: 30px; border-radius: 50%;"></div>
                        <div id="title">
                            <h4>${video.snippet.title}</h4>
                            <p class="channel-name">${video.snippet.channelTitle}</p>
                            <div class="stats">
                                <span class="views">${video.snippet.viewCount}</span>
                                <span class="publish-time">2 hours ago</span>
                            </div>
                        </div>
                 </div>
                `
                videoGalary.appendChild(card);
        })
}


// async function getVideoData(categoryId) {
//         const endPoint = `${BASE_URL}/search?part=snippet&maxResults=5&videoCategoryId=${categoryId}&key=${API_KEY}`;
//         const response = await fetch(endPoint);
//         const data = await response.json();
//         return data.items; // Return the video data for the category
// }

async function fetchVideo(searchQuery, maxResults) {
        const response = await fetch(`${BASE_URL}/search?key=${API_KEY}&q=${searchQuery}&maxResults=${maxResults}&part=snippet`);
        const data = await response.json();
        console.log(data);   
}




async function getVideoStats(videoId){
        const response = await fetch(`${BASE_URL}/videos?key=${API_KEY}&part=statistics&id=${videoId}`);
        const data = await response.json();

        const viewCount = data[0].statistics.viewCount;
        const likeCount = data[0].statistics.likeCount;


              if (viewCount > 1000 && viewCount < 999999) {
                viewCount = `${(viewCount / 1000).toFixed(1)}K`;
              }
              if (viewCount >= 1000000 && viewCount < 99999999) {
                viewCount = `${(viewCount / 1000000).toFixed(1)}M`;
              }
              if (viewCount >= 100000000) {
                viewCount = `${(viewCount / 100000000).toFixed(1)}B`;
              }
              if (likeCount > 1000 && likeCount < 999999) {
                likeCount = `${(likeCount / 1000).toFixed(1)}K`;
              }
              if (likeCount >= 1000000 && likeCount < 99999999) {
                likeCount = `${(likeCount / 1000000).toFixed(1)}M`;
              }
              if (likeCount >= 100000000) {
                likeCount = `${(likeCount / 100000000).toFixed(1)}B`;
              }
          
        return {viewCount, likeCount};
}
    
// viewCount
    
async function getChannelDetails(channelId){
        const response = await fetch(`${BASE_URL}/channels?key=${API_KEY}&part=snippet&part=statistics&id=${channelId}`);

        const data = await response.json();

        channelLogo = data.items[0].snippet.thumbnails.high.url;
        subscriberCount = data.items[0].statistics.subscriberCount;

        console.log(channelLogo, subscriberCount);
        return {channelLogo, subscriberCount};
}
    

    
async function getComments(videoId){
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API_KEY}&videoId=${videoId}&maxResults=25&part=snippet`);
        const data = await response.json();
        console.log(data);
}
    