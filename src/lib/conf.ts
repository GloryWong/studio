import Conf from 'conf';

const conf: any = new Conf({
  projectName: process.env.GSTUDIO_NAME,
  projectSuffix: '',
});

export default conf;
