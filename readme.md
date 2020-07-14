# Mobile Tracker

Geoawareness mobile tracker is a mobile website that emulates the customer experience for placing an order and tracking location as the customer progresses towards the store.

```
# configure gcloud shell project id
gcloud config set project <project_id>

# create bucket
gsutil mb gs://mobile-tracker-sbx.geoawareness.woolpert.dev

# set permissions
gsutil iam ch allUsers:objectViewer gs://mobile-tracker-sbx.geoawareness.woolpert.dev
```

Set up [Cloud Load balancing](https://cloud.google.com/storage/docs/hosting-static-website#lb-ssl) for https support.

Configure config.json with proper key values.

```
{
  "mobileTrackerKey": "YOUR_API_KEY",
  "geoawarenessRestApi": "api-sbx.geoawareness.woolpert.dev"
}
```

```
# copy static files
gsutil cp index.html mobile-tracker.js config.json gs://mobile-tracker-sbx.geoawareness.woolpert.dev
```
