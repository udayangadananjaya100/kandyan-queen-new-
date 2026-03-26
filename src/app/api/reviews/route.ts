import { NextResponse } from "next/server";

const PLACE_ID = "ChIJY1foQQBh4zoRiVSckamfXik";

export async function GET() {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        return NextResponse.json(
            { error: "Google Places API key not configured", reviews: [] },
            { status: 200 }
        );
    }

    try {
        const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "reviews,rating,userRatingCount",
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Places API error:", response.status, errorText);
            return NextResponse.json(
                { error: "Failed to fetch reviews", reviews: [] },
                { status: 200 }
            );
        }

        const data = await response.json();

        const reviews = (data.reviews || []).map(
            (review: {
                authorAttribution?: {
                    displayName?: string;
                    photoUri?: string;
                };
                rating?: number;
                text?: { text?: string };
                relativePublishTimeDescription?: string;
                originalText?: { text?: string };
            }) => ({
                name: review.authorAttribution?.displayName || "Anonymous",
                photo: review.authorAttribution?.photoUri || null,
                rating: review.rating || 5,
                text:
                    review.originalText?.text ||
                    review.text?.text ||
                    "",
                timeDescription:
                    review.relativePublishTimeDescription || "",
            })
        );

        return NextResponse.json({
            reviews,
            rating: data.rating || 0,
            totalReviews: data.userRatingCount || 0,
        });
    } catch (error) {
        console.error("Error fetching Google reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews", reviews: [] },
            { status: 200 }
        );
    }
}
