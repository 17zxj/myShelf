import React from 'react';
import routes from '../../../../config/router.config.js';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import styles from './index.less';

const Breadcrumbs = ({breadcrumbs}) => {
 
  if (breadcrumbs && breadcrumbs.length) {
    let data = breadcrumbs[breadcrumbs.length - 1].breadcrumb.props.children.split("/");
    return (
      <React.Fragment>
        {/* {breadcrumbs[breadcrumbs.length - 1].breadcrumb} */}
        {
          data.map((v,i)=>{
            return(
              <span key={i} className={i==data.length-1?styles.highlight:styles.normal}>{v}<span style={{margin:'0px 2px'}}>{i==data.length-1?"":"/"}</span></span>
            )
          })
        }
      </React.Fragment>
      
    )
  }
};

export default withBreadcrumbs(routes)(Breadcrumbs);
