import os
import base64
import shutil
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
from vertexai.preview.vision_models import Image, ImageGenerationModel
from bs4 import BeautifulSoup
import json
import io
from selenium import webdriver
from Screenshot import Screenshot
from threading import Lock
import time
import yaml
import random

class UniqueFolderCreator:
    def __init__(self):
        self.lock = Lock()
        self.num = 1

    def create_unique_folder(self, base_name):
        with self.lock:
            while True:
                folder_name = f"{base_name}{self.num}"
                if not os.path.exists(folder_name):
                    os.makedirs(folder_name)
                    return folder_name
                self.num += 1

class WebpageGenerator:
    def __init__(self, config):
        self.vertexai_project = config["vertexai"]["project"]
        self.vertexai_location = config["vertexai"]["location"]
        self.gemini_model_name = config["vertexai"]["model_name"]
        self.prompts_file_path = config["prompts_file_path"]
        self.image_gen_model = config["image_gen_model"]

        vertexai.init(project=self.vertexai_project, location=self.vertexai_location)
        self.model = GenerativeModel(self.gemini_model_name)

        self.generation_config = {
            "max_output_tokens": 8192,
            "temperature": 1,
            "top_p": 0.95,
        }

        self.image_desc_output = None
        self.image = None
        self.prompt_output_file = None
        prompts_file_path = os.path.join(os.getcwd(), self.prompts_file_path)
        prompts = self.read_prompts_from_yaml(prompts_file_path)['prompts']
        self.image_desc = prompts['image_desc']
        self.text_prompt = prompts['text_prompt']
        self.image_prompt = prompts['image_prompt']
        self.text_prompt_webpage = prompts['text_prompt_webpage']
        self.image_prompt_webpage = prompts['image_prompt_webpage']
        self.Designing_for = ""
        self.Target_users = ""
        self.Description = ""

    def read_prompts_from_yaml(self, file_path):
        with open(file_path, 'r') as file:
            prompts = yaml.safe_load(file)
        return prompts

    def image_to_base64(self, image_path):
        with open(image_path, "rb") as image_file:
            base64_string = base64.b64encode(image_file.read()).decode('utf-8')
            return base64_string

    def generate_summary(self):
        responses = self.model.generate_content(
            [self.image, self.image_desc],
            generation_config=self.generation_config,
            stream=False,
        )
        return responses.text

    def generate_from_scratch(self, Designing_for, Target_users, Description):
        self.Designing_for = Designing_for
        self.Target_users = Target_users
        self.Description = Description
        webpages = []
        for i in range(3):
            folder_creator = UniqueFolderCreator()
            folder_path = folder_creator.create_unique_folder("generated_websites/webpage")
            print(f"Created folder: {folder_path}") 

            self.image_prompt_webpage = self.image_prompt_webpage.replace("{designing_for}", Designing_for)
            self.image_prompt_webpage = self.image_prompt_webpage.replace("{target_users}", Target_users)
            self.image_prompt_webpage = self.image_prompt_webpage.replace("{description}", Description)
            
            self.prompt_output_file = f"{folder_path}/prompt_output.txt"
            page_output = self.generate_webpage(self.text_prompt_webpage, True)
            html_filename = f"{folder_path}/index.html"  
            css_filename = f"{folder_path}/style.css"
            self.save_gemini_vision_output(page_output, html_filename, css_filename )
            print(f"Saved HTML to: {html_filename}")
            print(f"Saved CSS to: (if applicable) {css_filename}")
            json_data = self.extract_img_data(html_filename)
            print(json_data)
            images_folder = f"{folder_path}/generated_images"
            image_folder_path = self.create_image_folder(images_folder)
            print(f"Created image folder: {image_folder_path}")
            self.generate_and_save_images(json_data, folder_path, self.image_prompt_webpage)
            output_image_name = "webpageimg.png"
            file_path = f"{os.getcwd()}/{html_filename}"
            variation_path = self.screen_screenshot(file_path, folder_path, output_image_name)
            webpages.append(self.image_to_base64(variation_path))
        return webpages


    def generate_ui_variations(self, image_base64):
        self.image = Part.from_data( mime_type="image/png", data=image_base64)
        self.image_desc_output = self.generate_summary()
        print("Image Summary:", self.image_desc_output)
        variations = []

        for i in range(3):
            folder_creator = UniqueFolderCreator()
            folder_path = folder_creator.create_unique_folder("generated_websites/variation")
            print(f"Created folder: {folder_path}") 
            background_image_path = self.pick_random_image()
            print(background_image_path)

            self.text_prompt = self.text_prompt.replace("background_image_path", background_image_path)
            print(self.text_prompt)

            self.prompt_output_file = f"{folder_path}/prompt_output.txt"
            page_output = self.generate_webpage(self.text_prompt, False)
            html_filename = f"{folder_path}/index.html"  
            css_filename = f"{folder_path}/style.css"
            self.save_gemini_vision_output(page_output, html_filename, css_filename )
            print(f"Saved HTML to: {html_filename}")
            print(f"Saved CSS to: (if applicable) {css_filename}")
            json_data = self.extract_img_data(html_filename)
            print(json_data)
            images_folder = f"{folder_path}/generated_images"
            image_folder_path = self.create_image_folder(images_folder)
            print(f"Created image folder: {image_folder_path}")
            self.generate_and_save_images(json_data, folder_path, self.image_prompt)
            output_image_name = "webpageimg.png"
            file_path = f"{os.getcwd()}/{html_filename}"
            variation_path = self.screen_screenshot(file_path, folder_path, output_image_name)
            variations.append(self.image_to_base64(variation_path))

        return variations

    def generate_webpage(self, prompt, only_text = False): 
        if only_text:
            responses = self.model.generate_content(
                [self.Designing_for, self.Target_users, self.Description, prompt],
                generation_config=self.generation_config,
                stream=False,
            )
        else:
            responses = self.model.generate_content(
                [self.image,self.image_desc_output, prompt],
                generation_config=self.generation_config,
                stream=False,
            )
            
        # Save the generated text to a file
        try:
            with open(self.prompt_output_file, 'w') as f:
                f.write(responses.text)
                print(f"Output saved to: {self.prompt_output_file}")
        except FileNotFoundError:
            print(f"Error: Could not create file {self.prompt_output_file}")

        return responses.text
       
    def save_gemini_vision_output(self, content, html_filename, css_filename): 
        # Split HTML and CSS content
        html_content = ""
        is_html = False
        css_content = ""
        is_css = False
        extra_content = ""
        
        for line in content.split('\n'):
            if line.strip().startswith("```html"):
                is_html = True
            elif line.strip().endswith("```"):
                is_html = False
            elif line.strip().startswith("```css"):
                is_css = True
            elif line.strip().startswith("```"):
                is_css = False
            elif is_css:
                css_content += line + '\n'
            elif is_html:
                html_content += line + '\n'
            else: 
                extra_content += line + '\n'

        # Write HTML content to index.html
        with open(html_filename, 'w') as html_file:
            html_file.write(html_content)

        # Write CSS content to style.css
        with open(css_filename, 'w') as css_file:
            css_file.write(css_content)

        print("Files 'index.html' and 'style.css' have been created successfully.")

    def extract_img_data(self, html_file):
        with open(html_file, 'r') as f:
            html_content = f.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        images = soup.find_all('img')

        image_data = []
        for image in images:
            src = image.get('src')
            alt = image.get('alt', "")  # Set default value for missing alt attribute
            image_data.append({"src": src, "alt": alt})

        return image_data

    def create_image_folder(self, images_folder):
        if not os.path.exists(images_folder):
            os.makedirs(images_folder)
            print(f"Image folder '{images_folder}' created.")
            return images_folder

    def generate_and_save_images(self, image_src_list, folder_path, prompt):
        img_generation_model = ImageGenerationModel.from_pretrained(self.image_gen_model)
        
        for idx, item in enumerate(image_src_list):
            print(f"Processing item {idx+1}")
            prompt_text = f"{prompt} {item.get('alt', '')}"
            print(f"{prompt_text}")

            images = img_generation_model.generate_images(
                prompt=prompt_text,
                number_of_images=1,
                add_watermark=False,
                safety_filter_level="block_some",
                person_generation="dont_allow"
            )

            # Check if images were generated (handle empty response)
            if not images.images:
                print(f"Warning: No images generated for prompt")
                static_image_path= self.pick_random_image()
                timestamp = int(time.time())
                temp_filename = f"{folder_path}/{timestamp}.tmp"
                shutil.copy2(static_image_path, temp_filename)
                filename = os.path.basename(item['src'])
                destination_path = os.path.join(folder_path,"generated_images",filename)
                print("Destination path image",destination_path)
                os.rename(temp_filename, destination_path)
                print(f"Image '{filename}' copied to generated_images folder.")
                continue
            image_bytes = io.BytesIO()
            images.images[0]._pil_image.save(image_bytes, format="PNG")  # Adjust format as needed

            # filename = (f"{os.getcwd()}/{item['src']}")  # Use src value for filename
            filename = (f"{folder_path}/{item['src']}")  # Use src value for filename
            with open(filename, "wb") as f:
                f.write(image_bytes.getvalue())

            print(f"Image '{filename}' generated and saved successfully!")

    def screen_screenshot(self, file_path, folder_path, output_image_name):
        ob = Screenshot.Screenshot()
        options = webdriver.ChromeOptions()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--start-maximized')
        cService = webdriver.ChromeService(executable_path='/snap/bin/chromium.chromedriver')
        driver = webdriver.Chrome(service=cService, options=options)
        driver.get(f"file://{file_path}")
        img_url = ob.full_screenshot(driver, save_path= folder_path, image_name=output_image_name, is_load_at_runtime=True, load_wait_time=3)
        print(f"Screenshot saved as: {img_url}")
        return img_url

    def pick_random_image(self):
        """Picks a random image file path from a directory using random.choice."""
        # Supported image extensions can be added/modified here

        folder_path = os.path.join(os.getcwd(), "background_images")
        print(folder_path)
        image_extensions = [".jpg", ".jpeg", ".png"]
        images = []
        for filename in os.listdir(folder_path):
            if os.path.isfile(os.path.join(folder_path, filename)):
                # Check if the filename extension matches an image extension
                if any(filename.endswith(ext) for ext in image_extensions):
                    images.append(os.path.join(folder_path, filename))
        if not images:
            # Handle case where no images are found
            return None
        return random.choice(images)