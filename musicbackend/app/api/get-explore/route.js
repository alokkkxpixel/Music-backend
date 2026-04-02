import { NextResponse } from "next/server";




export async function GET(request,response) {
    

    try {

    const response = await fetch(
    "https://music.youtube.com/youtubei/v1/browse?prettyPrint=false",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Origin": "https://music.youtube.com",
        "Referer": "https://music.youtube.com/",
        "X-Youtube-Client-Name": "67",
        "X-Youtube-Client-Version": "1.20240101.01.00"
      },
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB_REMIX",
            clientVersion: "1.20240101.01.00",
            hl: "en",
            gl: "US"
          }
        },
        browseId: "FEmusic_explore"
      })
    }
  );

  const data = await response.json();
 const sections =
    data.contents
      .singleColumnBrowseResultsRenderer
      .tabs[0]
      .tabRenderer
      .content
      .sectionListRenderer
      .contents;

  const result = sections
    .map(section => section.musicCarouselShelfRenderer)
    .filter(Boolean)
    .map(section => {

      const title =
        section.header
          ?.musicCarouselShelfBasicHeaderRenderer
          ?.title?.runs?.[0]?.text;

      const items = section.contents.map(item => {

        const renderer =
          item.musicTwoRowItemRenderer ||
          item.musicResponsiveListItemRenderer;

        return {
          title: renderer?.title?.runs?.[0]?.text,
          thumbnail: renderer?.thumbnailRenderer
            ?.musicThumbnailRenderer?.thumbnail?.thumbnails?.pop()?.url,
          browseId: renderer?.navigationEndpoint
            ?.browseEndpoint?.browseId,
          videoId: renderer?.navigationEndpoint
            ?.watchEndpoint?.videoId
        };
      });

      return {
        section: title,
        items
      };

    });

  return NextResponse.json(result);
  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      error: error.message
    });

  }

}
