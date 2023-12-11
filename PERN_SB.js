#!/usr/bin/env node
const { program } = require('commander');
const readline = require('readline');
const shell = require('shelljs');

const createPERN = (projectName, SUPABASE_URL, SUPABASE_ANON, SUPABASE_SECRET) => {
  

    console.log(`Creating ${projectName}...`);
    
    // Step 1: Create the project directory
    shell.exec(`mkdir ${projectName}`);

    // Step 2: Navigate to the project directory
    shell.cd(projectName);
    shell.exec('npm init -y');
    shell.exec('npm install concurrently --save-dev')
    shell.ShellString(`
    {
      "name": "app-create-test",
      "version": "1.0.0",
      "license": "ISC",
      
      "scripts": {
        "client": "npm run dev --prefix client",
        "server": "npm run serve --prefix server",
        "build-app": "npm run build --prefix client",
        "build-server": "npm run build --prefix server",
        "start": "concurrently --kill-others-on-fail \\"npm run client\\"  \\"npm run server\\"",
        "start:server": "npm run start --prefix server"
      },
      "engines": {
        "node": "14.15.0"
      },
     
      "devDependencies": {
        "concurrently": "^8.2.2"
      }
    }
    
    `).to(`package.json`)
    // Step 3: Set up the back end (Node.js + Express)
  
    shell.mkdir('server');
    shell.cd('server');
    shell.touch('.env')
    shell.ShellString(`
      SUPABASE_URL = ${SUPABASE_URL}
      SUPABASE_ANON = ${SUPABASE_ANON}
      SUPABASE_SECRET = ${SUPABASE_SECRET}
    `).to('.env')
    shell.touch('.gitignore')
    shell.echo('".env" >> .gitignore')
    // Step 4: Initialize npm for the back end
    shell.exec('npm init -y');
    shell.ShellString(`
    {
      "name": "@app-create-test/server",
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "serve": "nodemon api.js",
        "start": "node api.js"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "@supabase/supabase-js": "^2.39.0",
        "body-parser": "^1.20.2",
        "dotenv": "^16.3.1",
        "express": "^4.18.2",
        "nodemon": "^3.0.1",
        "pg": "^8.11.3"
      }
    }
    
    `).to('package.json')

    // Step 5: Install necessary dependencies (Express, body-parser)
    shell.exec('npm install express body-parser pg dotenv @supabase/supabase-js nodemon');

    // Step 6: Create a basic Express server file
    shell.ShellString(`
      const express = require('express');
      const bodyParser = require('body-parser');
      require("dotenv").config();
      const { createClient } = require('@supabase/supabase-js')
  
      const app = express();
      const PORT = process.env.PORT || 5001;
      
      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseAnonKey = process.env.SECRET_ANON
       //connect your supabase account and sanitize variables
      //const supabase = createClient(supabaseUrl, supabaseAnonKey)

      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      // Define your API routes here
            // app.get('/', async (req, res) => {
            //     try {
            //       const { data, error } = await supabase.from("your-table").select()
            //       if (error) {
            //         throw error
            //       }
            //       res.json(data)
            //     } catch (error) {
            //       console.log(error)
            //       res.status(500).json({ error: 'Something went wrong' })
            //     }
            //   })
      app.listen(PORT, () => {
          console.log(\`Server is running on port \${PORT}\`);
      });
    `).to('api.js');

    // Step 7: Navigate back to the project root
    shell.cd('..');
    shell.exec('npm link server')  
    // Step 8: Set up the front end (React)
    shell.exec('npm create vite@latest client -- --template react');
    shell.exec('npm link client')    
    // Step 9: Navigate to the client directory
    shell.cd('client');
    shell.touch('.env.local')
    shell.ShellString(`
      VITE_URL = ${SUPABASE_URL}
      VITE_ANON = ${SUPABASE_ANON}
      VITE_SECRET = ${SUPABASE_SECRET}
    `).to('.env')
    shell.touch('.gitignore')
    shell.echo('".env.local" >> .gitignore')
    shell.exec('npm install')
    shell.exec('npm install react-router-dom localforage match-sorter sort-by')
    shell.exec('npm install react-icons --save')
    // Step 10: Add configure file structure
    shell.cd('public')
    shell.rm('./vite.svg')
    shell.touch('_redirects')
    shell.touch('sitemap.xml')
    shell.cd('../src')
    shell.rm('./assets/react.svg')
    shell.mkdir('components')
    shell.cd('components')
    shell.touch('Navbar.css')
    shell.ShellString(`* {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          .navbar {
            background: #19191a;
            height: 80px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.2rem;
           
            top: 0;
            z-index: 999;
          }
          
          .navbar-container {
            display: flex;
            justify-content: space-between;
            height: 80px;
          }
          
          .container {
            z-index: 1;
            width: 100%;
            max-width: 1300px;
            margin-right: auto;
            margin-left: auto;
            padding-right: 50px;
            padding-left: 50px;
          }
          
          .navbar-logo {
            color: #fff;
            justify-self: start;
            cursor: pointer;
            text-decoration: none;
            font-size: 2rem;
            display: flex;
            align-items: center;
          }
          
          .navbar-icon {
            margin-right: 0.5rem;
          }
          
          .nav-menu {
            display: flex;
            align-items: center;
            justify-content: center;
            list-style: none;
            text-align: center;
            justify-content: flex-end;
          }
          
          .nav-item {
            height: 80px;
            border-bottom: 2px solid transparent;
          }
          
          .nav-item:hover {
            border-bottom: 2px solid #09bef0;
          }
          
          .nav-links {
            color: #fff;
            display: flex;
            align-items: center;
            text-decoration: none;
            padding: 0.5rem 1rem;
            height: 100%;
          }
          
          .activated {
            color: #09bef0;
          }
          
          .fa-bars {
            color: #fff;
          }
          
          .menu-icon {
            display: none;
          }
          
          @media screen and (max-width: 960px) {
            nav.navbar{
              position: sticky !important;
            }
            .NavbarItems {
              position: relative;
            }
          
            .nav-menu {
              display: flex;
              flex-direction: column;
              width: 100%;
              position: absolute;
              top: 80px;
              left: -100%;
              opacity: 1;
              transition: all 0.5s ease;
            }
          
            .nav-menu.active {
              background: #19191a;
              left: 0;
              opacity: 1;
              transition: all 0.6s ease;
              z-index: 1;
            }
          
            .nav-links {
              text-align: center;
              padding: 2rem;
              width: 100%;
              display: table;
            }
          
            .nav-links:hover {
              color: #09bef0;
              transform: scale(1.2);
              transition: all 0.3s ease;
            }
          
            .nav-item:hover {
              border: none;
            }
          
            .nav-item {
              width: 100%;
            }
          
            .navbar-logo {
              position: absolute;
              top: 0;
              left: 0;
              transform: translate(25%, 50%);
            }
          
            .menu-icon {
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              transform: translate(-100%, 60%);
              font-size: 1.8rem;
              cursor: pointer;
            }
          }`).to('Navbar.css')
    shell.touch('Navbar.jsx')
    shell.ShellString(`
    import React, {useState} from 'react'
    import { Link } from 'react-router-dom'
    import { NavLink } from 'react-router-dom'
    import "./Navbar.css"
    import {GiAbstract049} from "react-icons/gi" //find a seperate icon for logo
    import {FaBars, FaTimes} from "react-icons/fa"
    import {IconContext} from "react-icons"
    
    
    const Navbar = () => {
      const[click, setClick] = useState(false)
    
      const handleClick = () =>  setClick(!click)
      const closeMobileMenu = () => {setClick(false); window.scrollTo(0, 0)}
        
      
      
      return (
        <>
          <IconContext.Provider value={{color:"#fff"}}>
            <nav className="navbar">
                <div className="navbar-container container">
                    <Link to="/" className='navbar-logo' onClick={closeMobileMenu} style={{'marginBottom': '2%'}}>
                        <GiAbstract049 className='navbar-icon'
                        />
                        Hackworth
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                      {click? <FaTimes/>:<FaBars/>}
                    </div>
                    <ul className={click? "nav-menu active": "nav-menu"}>
                      <li className='nav-item'>
                        <NavLink to="/" className={({ isActive }) => "nav-links" + (isActive? " activated": '')} onClick={closeMobileMenu}>
                          Home
                        </NavLink>
                      </li>
                    </ul>
                </div>
            </nav>
          </IconContext.Provider>
        </>
      )
    }
    
    export default Navbar
    `).to('Navbar.jsx')
    shell.cd('..')
    shell.mkdir('routes')
    shell.cd('routes')
    shell.ShellString(`
    import React from 'react'
    import '../App.css';
    

    const Home = () => {
      return (
        <>
          <h1>Hello World</h1>
        </>
      )
    }
    
    export default Home
    ` ).to('Home.jsx')
    shell.ShellString(`

      import { useRouteError } from "react-router-dom";


        export default function ErrorPage() {
        const error = useRouteError();
        console.error(error);
      
        return (
          <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <i>{error.statusText || error.message}</i>
            </p>
          </div>
        );
      }` ).to('ErrorPage.jsx')
    shell.cd('..')
    shell.ShellString(`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", sans-serif;
      }
      
      /*scroll bar fun*/
      /* width */
      ::-webkit-scrollbar {
        width: 10px;
      }
      
      /* Track */
      ::-webkit-scrollbar-track {
        background: #19191a;
      }
      
      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px
      }
      
      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
      html, body { max-width: 100%; overflow-x: hidden; }
      /* base page*/
      .home{
        display: flex;
        height: 120vh;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        background-color: #19191a;
        color: #fff;
        overflow-x: hidden;
      }
      @media screen and (max-width: 960px) {
        .home{
          font-size: 2.5rem;
          background-size: cover;
        }
      #error-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }
      }
    `).to('App.css')
    shell.ShellString(`
      import * as React from "react";
      import { createRoot } from "react-dom/client";
      import {
        createBrowserRouter,
        RouterProvider
      } from "react-router-dom";
      import Home from "./routes/Home";
      import Navbar from "./components/Navbar";
      import { Outlet } from "react-router-dom";
      import ErrorPage from "./routes/ErrorPage";
      import "./App.css"
      
      const AppLayout = () =>{
      
        return(
          <>
          <Navbar/>
          <Outlet/>
          </>
        )
      }

      const router = createBrowserRouter([
        {
          element: <AppLayout/>,
        errorElement: <ErrorPage/>,
          children:[
            {
              path: "/",
              element: <Home/>
            }
          ]
        }
        
        
      
      ]);
      
      createRoot(document.getElementById("root")).render(
        <RouterProvider router={router} />
      );
    `).to('App.jsx')
    shell.rm('index.css')
    shell.rm('main.jsx')
    shell.ShellString(`
        <!doctype html>
        <!--html lang="en" data-bs-theme="dark"-->
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <!--link rel="icon" type="image/png" href="/favicon.png" -->
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${projectName}</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/App.jsx"></script>
          </body>
        </html>      
    `).to('index.html')  
    shell.cd('..')    
       








    console.log(`Project ${projectName} created successfully!`);
  

program.parse(process.argv);
}

module.exports = { createPERN }
//sudo ln -s /Development/personal/create-PERN-app/create-Hackworth-app.js  /usr/bin/cdha move to path
//sudo chmod +x /usr/bin/cdha
//execute using cdha create <project-name>