// import { STORYBOOK_IFRAME_HEIGHT_MESSAGE_TYPE } from './constant';
// function sendHeight() {
//   const height = document.body.scrollHeight;
//   window.parent.postMessage(
//     {
//       type: STORYBOOK_IFRAME_HEIGHT_MESSAGE_TYPE,
//       height,
//     },
//     '*'
//   );
//   console.log('send', height)
// }
// export const PreComponentsStorybookDecorator: Decorator = (Story) => {
//       useEffect(() => {
//         const resizeObserver = new ResizeObserver(() => {
//           sendHeight();
//         });
//         resizeObserver.observe(document.body);

//         window.addEventListener('DOMContentLoaded', sendHeight);
//         window.addEventListener('load', sendHeight);

//         return () => {
//             resizeObserver.disconnect()
//             window.removeEventListener('DOMContentLoaded', sendHeight);
//             window.removeEventListener('load', sendHeight);
//         }
//       }, []);
//       return <Story />
//     }

export {}