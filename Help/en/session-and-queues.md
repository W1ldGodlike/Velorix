# Sessions, queues, and “Download → Process”

## ui-session.json

Queues on the **Download** and **Processing** tabs and the main form fields are saved to `%LocalAppData%\FluxAlloy\ui-session.json` about every 55 seconds and on app exit. Any queue row in `Running` is normalized back to `Queued` when saved.

## After download

The **add to processing** and **after the whole queue run batch** flags collect successful paths from the yt-dlp log **after the entire download queue has finished**, so the same files are not re-encoded in the middle of the queue between jobs.

## Tips

If you want manual control between steps, keep only enqueue-to-processing and press **Run batch** on the ffmpeg tab when you are ready.
