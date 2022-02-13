import handlebars from 'handlebars';

interface ITemplateVariable {
  [key: string]: number | string;
}

interface IParseMailTemplate {
  template: string;
  variables: ITemplateVariable;
}

export default class handlebarsMailTemplate {
  public async parse({
    template,
    variables,
  }: IParseMailTemplate): Promise<string> {
    const parseTemplate = handlebars.compile(template);

    return parseTemplate(variables);
  }
}
