
import React from 'react';
import TabBar from "@material/react-tab-bar";
import Tab from "@material/react-tab";

export default class Header extends React.Component{
    state = {activeIndex: 0};

    handleActiveIndexUpdate = (activeIndex) => this.setState({activeIndex});

    render() {
        return (
            <div>
                <TabBar
                    activeIndex={this.state.activeIndex}
                    handleActiveIndexUpdate={this.handleActiveIndexUpdate}
                >
                    <Tab>
                        <span className='mdc-tab__text-label mdc-tab--active'>One</span>
                    </Tab>
                    <Tab>
                        <span className='mdc-tab__text-label'>Two</span>
                    </Tab>
                    ...
                </TabBar>
            </div>
        );
    }
}