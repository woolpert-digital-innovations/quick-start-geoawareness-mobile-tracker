# Mobile Tracker

GeoAwareness Mobile Tracker is a mobile website that emulates the customer experience for placing an order and tracking location as the customer progresses towards the store.

## Prerequisites

1. [Create an API key](https://cloud.google.com/docs/authentication/api-keys#creating_an_api_key). Mobile Tracker uses API key authentication for Google Maps and GeoAwareness APIs. Take care to follow API key best practices, including [Securing an API key](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key). The API key must have permissions for the Google Maps Platform
   [JavaScript API](https://developers.google.com/maps/documentation/javascript/overview),
   [Directions API](https://developers.google.com/maps/documentation/directions/overview)
   and the GeoAwareness REST API.

1. Configure - Edit `config.json` for your environment with proper values.

## Running Locally

```
python3 -m http.server
```

The web application is available at [http://locahost:8000](http://localhost:8000).

## Deploy to GCP

Mobile Tracker is hosted in Google Cloud Storage as a static website.

1. Create GCS bucket. Choose a custom domain name and create a bucket.

   ```
   # create bucket
   gsutil mb gs://mobile-tracker.<your-domain> # eg. gs://mobile-tracker.geoawareness.woolpert.dev

   # set permissions
   gsutil iam ch allUsers:objectViewer gs://mobile-tracker.<your-domain>
   ```

1. HTTPs support. Set up [Cloud Load balancing](https://cloud.google.com/storage/docs/hosting-static-website#lb-ssl) for https support.

1. Deploy website to GCS bucket.

   ```
    # remove all files
    gsutil rm -r gs://mobile-tracker.<your-domain>/*

    # copy static files
    gsutil cp -r src assets index.html config.json favicon.ico gs://mobile-tracker.<your-domain>

    # optionally remove default cache settings, useful for development and testing
    gsutil -m setmeta -r -h "Cache-Control:no-cache, max-age=0" gs://mobile-tracker.<your-domain>/*
   ```
