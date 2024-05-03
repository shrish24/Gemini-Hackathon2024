## DETAILS

**Google Project Id:** hackathon-420406 
**Gemini API Used:** Vertex AI

**DESCRIPTION**
A/B testing, also known as split testing or bucket testing, is a methodology for comparing two versions of a design, webpage or app to determine which one performs better. It helps businesses figure out what works for their specific context and avoid relying on assumptions, which can lead to less effective marketing strategies and wasteful resource allocation.
This project aims to provide a comprehensive report based on the input images and then create variations based on the image selected.

# BACKEND

**Getting Started**

This project requires Python to be installed on your system. You can download it from the official website at https://www.python.org/downloads/

**Note:** Google Project ID and Vertex AI Models are configured in "backend/config.yml". 

**Dependencies**
This project relies on several external libraries.Create a virtual environment and install all the required dependencies.

Create a virtual environment:

`python -m venv /path/to/new/virtual/environment`

Install Dependencies in the virtual environment created:

`pip install -r requirements.txt`

This will download and install all the necessary dependencies listed in the requirements.txt file.

**Running the Server**
Once the dependencies are installed, you can start the server by running:

`python app.py`

**Note** The server will run on Port '9000'. Please ensure that no other service is running on the Port.

This will launch the server application. The specific behavior of the server will depend on the implementation within app.py.


# FRONTEND

# UI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
