import { NextResponse } from "next/server";
import ytdlp from "yt-dlp-exec";

export async function GET({ params }) {

      try{

      const { id } = await params;

      const info = await ytdlp(
        `https://youtube.com/watch?v=${id}`,
        {
          dumpSingleJson: true,
          noWarnings: true
        }
      );

      const audio = info.formats
        .filter(f => f.acodec !== "none")
        .sort((a,b)=>(b.abr||0)-(a.abr||0))[0];

     return NextResponse.json({
        id: info.id,
        title: info.title,
        artist: info.uploader,
        duration: info.duration,
        thumbnail: info.thumbnail,
        streamUrl: audio?.url
      });

    }
    catch(err){

      return NextResponse.json({
        success:false,
        error:err.message
      });

    }
}