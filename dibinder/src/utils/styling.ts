function getElementStyle(isActive: boolean) {
    return {
        sideBarElement: `text-dark ${isActive ? 'w-[25%] h-screen' : 'w-[4%] h-fit'}`,
        sideBarBackground: `h-full  ${isActive ? 'bg-secondary' : 'bg-transparent'} rounded-e-xl flex flex-col`,
        sideBarContainer: `w-full flex flex-row justify-between items-center ${isActive ? 'p-4' : 'px-2 py-4'}`,
        sideBarTextUsername: `text-xl font-bold ${isActive ? 'block' : 'hidden'}`,
        sideBarTaskList: ` mx-4 ${isActive ? 'block border-b border-b-gray-400/40' : 'hidden'}`,
        sideBarList: `mx-4 py-2 ${isActive ? 'block border-b border-b-gray-400/40 ' : 'hidden'}`,
        sideBarMiniMenu: `w-full h-full items-end ${isActive ? 'grid' : 'hidden'}`,
        taskLayout: `${isActive ? 'w-[45%]' : 'w-[62%]'} h-full`,
        taskDetail: `${isActive ? 'w-[30%]' : 'w-[34%]'} h-screen text-dark`
    }
}

export default getElementStyle;