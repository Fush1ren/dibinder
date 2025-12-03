function getElementStyle(sideBarActive: boolean, taskDetailActive: boolean) {
    return {
        sideBarElement: `text-dark ${sideBarActive ? 'w-[25%] h-screen' : 'w-[4%] h-fit'}`,
        sideBarBackground: `h-full  ${sideBarActive ? 'bg-secondary' : 'bg-transparent'} rounded-e-xl flex flex-col`,
        sideBarContainer: `w-full flex flex-row justify-between items-center ${sideBarActive ? 'p-4' : 'px-2 py-4'}`,
        sideBarTextUsername: `text-xl font-bold ${sideBarActive ? 'block' : 'hidden'}`,
        sideBarTaskList: ` mx-4 ${sideBarActive ? 'block border-b border-b-gray-400/40' : 'hidden'}`,
        sideBarList: `mx-4 py-2 ${sideBarActive ? 'block border-b border-b-gray-400/40 ' : 'hidden'}`,
        sideBarMiniMenu: `w-full h-full items-end ${sideBarActive ? 'grid' : 'hidden'}`,
         taskLayout:
            `${sideBarActive && taskDetailActive
                ? 'w-[45%]'
                : sideBarActive && !taskDetailActive
                ? 'w-[75%] pr-2'
                : !sideBarActive && taskDetailActive
                ? 'w-[62%]'
                : 'w-[96%]'} h-full `,
        taskDetail: `${sideBarActive ? 'w-[30%]' : 'w-[34%]'} h-screen text-dark`
    }
}

// function getElementStyle(isActive: boolean) {
//     return {
//         sideBarElement: `text-dark ${isActive ? 'w-[25%] h-screen' : 'w-[4%] h-fit'}`,
//         sideBarBackground: `h-full  ${isActive ? 'bg-secondary' : 'bg-transparent'} rounded-e-xl flex flex-col`,
//         sideBarContainer: `w-full flex flex-row justify-between items-center ${isActive ? 'p-4' : 'px-2 py-4'}`,
//         sideBarTextUsername: `text-xl font-bold ${isActive ? 'block' : 'hidden'}`,
//         sideBarTaskList: ` mx-4 ${isActive ? 'block border-b border-b-gray-400/40' : 'hidden'}`,
//         sideBarList: `mx-4 py-2 ${isActive ? 'block border-b border-b-gray-400/40 ' : 'hidden'}`,
//         sideBarMiniMenu: `w-full h-full items-end ${isActive ? 'grid' : 'hidden'}`,
//         taskLayout: `${isActive ? 'w-[45%]' : 'w-[62%]'} h-full`,
//         taskDetail: `${isActive ? 'w-[30%]' : 'w-[34%]'} h-screen text-dark`
//     }
// }

// export function getElementStyles(sideBarActive: boolean, taskDetailActive: boolean) {
//     return {
//         sideBarElement: `text-dark ${sideBarActive ? 'w-[25%] h-screen' : 'w-[4%] h-fit'}`,
//         taskLayout: `${sideBarActive && taskDetailActive ? 'w-[45%]' : taskDetailActive && !taskDetailActive ? 'w-[62%]' : 'w-full'} h-full`,
//     }
// }

// export function getElementStyles(sideBarActive: boolean, taskDetailActive: boolean) {
//     return {
//         sideBarElement: `text-dark ${sideBarActive ? 'w-[25%] h-screen' : 'w-[4%] h-fit'}`,
//         taskLayout:
//             `${sideBarActive && taskDetailActive
//                 ? 'w-[45%]'
//                 : sideBarActive && !taskDetailActive
//                 ? 'w-[75%] pr-2'
//                 : !sideBarActive && taskDetailActive
//                 ? 'w-[62%]'
//                 : 'w-[96%]'} h-full `,
//     };
// }


export default getElementStyle;