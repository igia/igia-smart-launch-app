/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v.
 * 2.0 with a Healthcare Disclaimer.
 * A copy of the Mozilla Public License, v. 2.0 with the Healthcare Disclaimer can
 * be found under the top level directory, named LICENSE.
 * If a copy of the MPL was not distributed with this file, You can obtain one at
 * http://mozilla.org/MPL/2.0/.
 * If a copy of the Healthcare Disclaimer was not distributed with this file, You
 * can obtain one at the project website https://github.com/igia.
 *
 * Copyright (C) 2018-2019 Persistent Systems, Inc.
 */
import React from 'react';
import { Collapse, Card, CardBody, Row } from 'reactstrap';

export interface IThreadItemProps {
  threadDumpInfo: any;
}

export interface IThreadItemState {
  collapse: boolean;
}

export class ThreadItem extends React.Component<IThreadItemProps, IThreadItemState> {
  state: IThreadItemState = {
    collapse: false
  };

  toggleStackTrace = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };

  render() {
    const { threadDumpInfo } = this.props;

    return (
      <div>
        <a onClick={this.toggleStackTrace} style={{ color: 'hotpink' }}>
          {this.state.collapse ? <span>Hide StackTrace</span> : <span>Show StackTrace</span>}
        </a>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              <Row className="break" style={{ overflowX: 'scroll' }}>
                {Object.entries(threadDumpInfo.stackTrace).map(([stK, stV]: [string, any]) => (
                  <samp key={`detail-${stK}`}>
                    {stV.className}.{stV.methodName}
                    <code>
                      ({stV.fileName}:{stV.lineNumber})
                    </code>
                  </samp>
                ))}
                <span className="mt-1" />
              </Row>
            </CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}

export default ThreadItem;
