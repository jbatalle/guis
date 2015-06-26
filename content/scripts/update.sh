## Pull MQNaaS code
echo "Updating MQNaaS code..."
cd mqnaas/
git pull -ff
## Pull tson code
echo "Updating TSON code..."
cd ../tson/
git pull -ff
## Pull NITOS code
echo "Updating NITOS code..."
cd ../nitos/
git pull -ff
## Pull content-utilities code
echo "Updating Content-Utilities code..."
cd ../content-utilities/ 
git pull -ff

cd ..

