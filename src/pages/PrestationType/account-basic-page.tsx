import { Fragment } from 'react';
import { AccountBasicContent } from './account-basic-content';

const AccountBasicPage = () => {
  return (
    <Fragment>
      {/* Conteneur principal qui remplace <Container> et <Toolbar> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        
        {/* En-tête simple (Optionnel, car le contenu a déjà un titre) */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Administration
          </h1>
          <p className="text-sm text-gray-500">
            Gestion des paramètres et des références.
          </p>
        </div>

        {/* Le contenu principal (Tableau) */}
        <AccountBasicContent />
        
      </div>
    </Fragment>
  );
};

export { AccountBasicPage };