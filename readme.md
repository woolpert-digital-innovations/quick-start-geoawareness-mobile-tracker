# Mobile Tracker

Geoawareness mobile tracker is a mobile website that emulates the customer experience for placing an order and tracking location as the customer progresses towards the store.

```
# configure gcloud shell project id
gcloud config set project <project_id>

# create bucket
gsutil mb gs://mobile-tracker-<env>.geoawareness.woolpert.dev

# set permissions
gsutil iam ch allUsers:objectViewer gs://mobile-tracker-<env>.geoawareness.woolpert.dev
```

Set up [Cloud Load balancing](https://cloud.google.com/storage/docs/hosting-static-website#lb-ssl) for https support.

Configure config.json with proper key values.

```
cp config-<env>.json config.json
```

```
# remove all files
gsutil rm -r gs://mobile-tracker-<env>.geoawareness.woolpert.dev/*

# copy static files
gsutil cp -r index.html config.json src assets favicon.ico gs://mobile-tracker-<env>.geoawareness.woolpert.dev

# remove default cache
gsutil -m setmeta -r -h "Cache-Control:no-cache, max-age=0" gs://mobile-tracker-<env>.geoawareness.woolpert.dev/*
```
