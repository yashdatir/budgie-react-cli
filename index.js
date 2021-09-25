const readLine = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});
const fs = require('fs');
const { exec } = require('child_process')

let state = {
	projectName: 'BudgieReact',
	closeApp: false,
	readmeContent:
		'# Budgie React Boilerplate\n## Welcome to the new project, where we can create exciting react templates which will be fully customized and flexible to work with. Clone this project to know more.\n### To Clone this project, use:\n```git clone https://github.com/yashdatir/budgie-react.git```\n### Install Node dependency\n```npm i```\n### Start the project\n```npm run start:dev```',
	packageJSON: {
		entry: 'index.js',
		scripts: {
			test: 'echo "Error: no test specified" && exit 1',
			'start:dev': 'webpack-dev-server .',
			build: 'webpack .',
		},
		keywords: [],
		author: '',
		license: 'ISC',
		devDependencies: {
			'@babel/core': '^7.15.5',
			'@babel/plugin-syntax-dynamic-import': '^7.8.3',
			'@babel/plugin-transform-runtime': '^7.15.0',
			'@babel/preset-env': '^7.15.6',
			'@babel/preset-react': '^7.14.5',
			'@babel/runtime': '^7.15.4',
			'babel-eslint': '^10.1.0',
			'babel-loader': '^8.2.2',
			eslint: '^7.32.0',
			'eslint-config-airbnb-base': '^14.2.1',
			'eslint-config-prettier': '^8.3.0',
			'eslint-plugin-jest': '^24.4.2',
			webpack: '^4.43.0',
			'webpack-cli': '^3.3.1',
			'webpack-dev-server': '^3.10.3',
		},
		dependencies: {
			react: '^17.0.2',
			'react-dom': '^17.0.2',
			'react-redux': '^7.2.5',
			'react-router-dom': '^5.3.0',
			redux: '^4.1.1',
		},
	},
	webpackFileContent: `
    const path = require("path");

module.exports = {
    mode: "development",
    entry: "./index.js",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "main.js"
    },
    target: "node",
    devServer: {
        port: "3000",
        contentBase: ["./public"],
        open: true,
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"]
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        }]
    }
}
    `,
    indexContent: `
    import React from 'react';
import ReactDOM from "react-dom";
import AppInit from "./app/AppInit";

ReactDOM.render(<AppInit />, document.getElementById("root"));
    `,
    babelrcContent: `{
        "presets": ["@babel/preset-env", "@babel/preset-react"],
        "plugins": ["@babel/plugin-syntax-dynamic-import", "@babel/plugin-transform-runtime"]
    }`,
    indexHTML: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Budgie-React</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="main.js"></script>
    </body>
    </html>`
};

function create_package_json(name) {
	const {
		packageJSON: {
			dependencies,
			devDependencies,
			scripts,
			entry,
			keywords,
			author,
			license,
		},
	} = state;
	return {
		name,
		version: '0.0.1',
		description: '',
		main: entry,
		scripts,
		keywords,
		author,
		license,
		devDependencies,
		dependencies,
	};
}

function create_project(name) {
	fs.mkdir(name, (err) => {
		if (err) {
			return err;
		}
		fs.writeFileSync(`./${name}/README.md`, state.readmeContent, (err) => {
			if (err) throw err;
		});
		fs.writeFileSync(
			`./${name}/package.json`,
			JSON.stringify(create_package_json(name)),
			(err) => {
				if (err) throw err;
			},
		);
        fs.writeFileSync(
			`./${name}/webpack.config.js`,
			state.webpackFileContent,
			(err) => {
				if (err) throw err;
			},
		);
        fs.writeFileSync(
			`./${name}/index.js`,
			state.indexContent,
			(err) => {
				if (err) throw err;
			},
		);
        fs.writeFileSync(
			`./${name}/.babelrc`,
			state.babelrcContent,
			(err) => {
				if (err) throw err;
			},
		);
        create_react(name);
	});
}

function create_react(name) {
    fs.mkdir(`${name}/public`, (err)=>{
        if(err){
            return err
        }
        fs.writeFileSync(
			`./${name}/public/index.html`,
			state.indexHTML,
			(err) => {
				if (err) throw err;
			},
		);
    })
    fs.mkdir(`${name}/app`, (err)=>{
        if(err){
            return err;
        }
        fs.writeFileSync(
			`./${name}/app/AppInit.jsx`,
			`
            import React from "react"
            const AppInit = () => {
                return (
                    <>Hello World</>
                )
            }
            export default AppInit
            `,
			(err) => {
				if (err) throw err;
			},
		);
    });
    console.log("Initialized with a boiler...");
    console.log("Installing Node Modules!")
    exec(`cd ${name} && npm i`, (error, stdout, stderr)=>{
        if(error){
            console.log(error);
            return null;
        }
        else if(stderr){
            console.log(stderr);
            return null;
        }
    
        console.log(stdout)
        
    });
}

function create_pages() {}

function create_components() {}

(function init() {
	console.log('...Welcome to BudgieReact...');
	readLine.question(
		`What would you prefer as your project name?[${state.projectName}]: `,
		(text) => {
			if (text) {
				state = {
					...state,
					projectName: text,
				};
			}
			create_project(state.projectName);
			readLine.close();
		},
	);
})();
