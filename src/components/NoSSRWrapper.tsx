import React from 'react';
import dynamic from 'next/dynamic';

function NoSSRWrapper(props: React.PropsWithChildren) {
  return <React.Fragment>{props.children}</React.Fragment>;
}

export default dynamic(() => Promise.resolve(NoSSRWrapper), {
  ssr: false
});
