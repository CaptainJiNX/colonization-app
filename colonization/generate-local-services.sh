#!/bin/sh
FILE="local-services.yml"

echo "version: \"2\"" > $FILE
echo "services:" >> $FILE

for service in $(echo $LOCAL_SERVICES | tr ";" "\n")
do
	echo "  $service:" >> $FILE
	echo "    image: ctjinx/$service:local" >> $FILE
	echo "" >> $FILE
done
