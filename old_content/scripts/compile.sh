## Compile MQNaaS core
cd mqnaas/
~/apache-maven-3.2.5/bin/mvn bundle:clean clean install bundle:install -DskipTests
## Compile MQNaaS extensions
cd extensions/
~/apache-maven-3.2.5/bin/mvn bundle:clean clean install bundle:install -DskipTests
## Compile TSON code
cd ../tson
~/apache-maven-3.2.5/bin/mvn bundle:clean clean install bundle:install -DskipTests
## Compile NITOS code
cd ../nitos
~/apache-maven-3.2.5/bin/mvn bundle:clean clean install bundle:install -DskipTests
## Compile content-utilities
cd ../content-utilities
~/apache-maven-3.2.5/bin/mvn bundle:clean clean install bundle:install -DskipTests
cd ..

