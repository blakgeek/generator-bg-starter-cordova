#!/bin/bash

IFS=',' read -ra platforms <<< "${CORDOVA_PLATFORMS}"
for platform in "${platforms[@]}"; do
    if [[ "${platform}" == "android" ]]; then
        echo "Copying release properties"
        cp ~/.android/release.properties platforms/android/release-signing.properties
    fi
done
