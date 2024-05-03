import vertexai
from vertexai.generative_models import GenerativeModel, Part
import vertexai.preview.generative_models as generative_models
import os
import yaml
import json

class ReportGenerator:
    def __init__(self, config):
        self.vertexai_project = config["vertexai"]["project"]
        self.vertexai_location = config["vertexai"]["location"]
        self.gemini_model_name = config["vertexai"]["model_name"]
        self.prompts_file_path = config["prompts_file_path"]

        prompts_file_path = os.path.join(os.getcwd(), self.prompts_file_path)
        print(prompts_file_path)
        prompts = self.read_prompts_from_yaml(prompts_file_path)['prompts']
        self.report_generation_prompt = prompts['report_generation_prompt']
        vertexai.init(project=self.vertexai_project, location=self.vertexai_location)
        self.model = GenerativeModel(self.gemini_model_name)
        self.generation_config = {
            "max_output_tokens": 8192,
            "temperature": 1,
            "top_p": 0.95,
        }
        self.images = None

    def generate(self, images, test_parameters):

        test_parameters = ["- " + item for item in test_parameters]
        self.report_generation_prompt = self.report_generation_prompt.replace("additional_parameters", '\n'.join(test_parameters))
        self.images = images
        responses = self.model.generate_content(
            [*self._create_images_list(images), self.report_generation_prompt],
            generation_config=self.generation_config,
            stream=False,
        )
        report_output = responses.text
        return self.process_report_output(report_output)
    
    def read_prompts_from_yaml(self, file_path):
        with open(file_path, 'r') as file:
            prompts = yaml.safe_load(file)
        return prompts

    @staticmethod
    def _create_images_list(images):
        images_list = []
        for image in images:
            image_part = Part.from_data(
                mime_type="image/png",
                data=image,
            )
            images_list.append(image_part)
        return images_list

    def process_report_output(self, report_output):
        output = report_output.replace("```", "").replace("json", "").replace("JSON", "")
        output_json = json.loads(output)
        output_json["Images"] = {}
        for i, image in enumerate(self.images, start=1):
            output_json["Images"]["Image_"+str(i)] = image
        return output_json