This application provides a way for creating an organization chart to display employee/manager relationships for a company

PREREQUISITE

An API server is required for data access and manipulation which is provided by the API server application
called "orgchart-api-server" (https://github.com/binyam455/orgchart-api-server) which must be installed and run before executing this application

INSTALLATION

Download the project and run command "npm install" in the project directory followed by the command "npm run dev"

USAGE

a. Access the location "localhost:3000" in a browser

b. When there are no employees, a button named "Add Root" is displayed. Click on it and fill out
   the displayed form to insert the first node

c. Hovering on a node displays "Add", "Edit", "Delete" and "Info" icons. Click on them and fill out
   relevant forms to insert, modify, delete and view nodes.

    Add (plus-sign icon) - this adds a new node under the selected node

    Edit (document icon) - this allows updating of the "name" and "description" attributes of a node

    Delete (trashcan icon) - this deletes the selected node and all its children

    Info ("i" icon) - this displays the "name", "description" and "manager" of a selected node
