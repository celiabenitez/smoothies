// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

Deno.serve(async (req) => {
  const payload = await req.json();
  
  // Log the entire JSON payload
  console.log("Received JSON payload:", JSON.stringify(payload, null, 2));

  // Ensure that payload.record exists
  if (payload.record) {
    // Use payload.record.title and payload.record.content if present
    const title = payload.record.title || "Default Title";
    const content = payload.record.content || "Default Content";

    // Use payload.record['big-Image'] if present, otherwise use a default big image URL
    const bigImage = "https://images.squarespace-cdn.com/content/v1/5c19da3985ede1c814d97da8/1548844745619-YCOOZIYFMCJENYFBFA21/ITK-Logo.png?format=1500w";

    // Construct the OneSignal notification body using payload data
    const oneSignalBody = {
      app_id: "b9c41c33-8196-4883-a129-21ce0ce5df41", // Include your app_id
      included_segments: ["Total Subscriptions"],
      contents: {
        en: content, // Use payload content as notification content
        es: content
      },
      headings: {
        en: title, // Use payload title as the notification heading
        es: title
      },
      chrome_web_icon: bigImage, // Use big image URL from payload or default URL %antes big_picture
      name: "INTERNAL_CAMPAIGN_NAME",
      data: {
        type: payload.type,
        table: payload.table,
        record: payload.record
        // Add more fields as needed
      }
    };

    // Now, let's make the request to OneSignal
    try {
      const response = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic MmI1ZjdkYjctOTJiNS00NmMyLWE5NWYtMzAwNDNkNmZhNjQy"
        },
        body: JSON.stringify(oneSignalBody)
      });

      const responseData = await response.json();
      console.log("OneSignal API Response:", responseData);

      const data = {
        message: "Payload received successfully",
        oneSignalResponse: responseData
      };

      return new Response(
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (error) {
      console.error("Error making OneSignal API request:", error);

      const errorMessage = {
        error: "Failed to send notification to OneSignal"
      };

      return new Response(
        JSON.stringify(errorMessage),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
  } else {
    // Handle the case where payload.record is not present
    console.error("Payload is missing the 'record' field");
    // You might want to return an error response or handle it as appropriate for your use case
  }
});
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/Send_Notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
