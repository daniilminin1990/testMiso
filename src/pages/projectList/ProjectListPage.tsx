// import { Button } from '@v-uik/base';
import { Button as AntButton } from 'antd';
import { ProjectListContainer } from './ProjectListContainer';
import { useNavigate } from 'react-router';
import { projectPageApi } from '@pages/project/projectPageApi';
import { showErrorNotification } from '@shared/ui/showErrorNotification';
import * as styles from './ProjectListPage.module.scss';
import PageTitle from '@shared/ui/PageTitle';
export const ProjectListPage = () => {
  const navigate = useNavigate();
  const redirectToProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };
  return (
    <>
      <PageTitle title="Центр проектов" />
      {/* TODO EDIT styles one format */}
      <div style={{ margin: '30px 0' }}>
        <h2>Создание АП:</h2>
        <div style={{ margin: '15px 0' }}>
          {/*<Button*/}
          {/*  size="lg"*/}
          {/*  onClick={() => {*/}
          {/*    projectPageApi.createForm().then(redirectToProject).catch(showErrorNotification);*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Создать новый АП*/}
          {/*</Button>*/}
          <AntButton
            size="large" // Аналог size="lg" из @v-uik/base
            onClick={() => {
              projectPageApi.createForm().then(redirectToProject).catch(showErrorNotification);
            }}
          >
            Создать новый АП
          </AntButton>
        </div>
      </div>

      {/* TODO EDIT styles one format */}
      <div style={{ margin: '30px 0' }}>
        <h2>АП:</h2>
        <div
          style={{
            margin: '10px'
          }}
        >
          <ProjectListContainer
            // TODO EDIT можно сократить
            // onSelect={(projectId) => { redirectToProject(projectId) }}
            onSelect={redirectToProject}
          />
        </div>
      </div>
    </>
  );
};
