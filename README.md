Homepage
========

This is my personal website.

## Requirements for building

### NodeJS
Get the latest from http://nodejs.org/

### Ruby, Sass & Compass
#### Mac
	sudo gem install sass
	sudo gem install compass

#### Linux
	sudo apt-get install ruby
	sudo apt-get install rubygems
	sudo gem install sass
	sudo gem install compass

#### Windows
Get Ruby from http://rubyinstaller.org/
	gem install sass
	gem install compass

### Node packages
	npm install
	
### Grunt
The above will install grunt and grunt-cli but by default this will not work because grunt-cli needs to be in your PATH. 

#### Solution 1
Just use the local version:
##### Mac & Linux
	??
##### Windows
	call node_modules/.bin/grunt
	
#### Solution 2
Install grunt-cli globally like:
##### Mac & Linux
	sudo npm install -g grunt-cli
##### Windows
	npm install -g grunt-cli
Then you can just build as normal with:
	grunt 
