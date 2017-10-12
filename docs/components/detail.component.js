import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco as codeStyle } from 'react-syntax-highlighter/dist/styles';
import buildJSXWithContext from '../common/build-jsx-with-context';
import * as rmwc from '../../src';
import * as rmwcElements from '../../elements';

const {
	Grid,
	GridCell,
	Typography,
	Card,
	List,
	ListGroup,
	ListGroupSubheader
} = rmwc;

const cleanExampleCode = (codeString = '') => {
	const parts = codeString.split('\n').slice(1, -1) || [];
	const tabsCount = (parts[0] || '').search(/(?!\t)/);
	const regex = new RegExp('\t'.repeat(tabsCount < 0 ? 0 : tabsCount));
	return parts.map(val => val.replace(regex, '')).join('\n');
};

export class Detail extends React.Component {
	state = {};

	render() {
		const { section } = this.props;
		const componentClasses = !Array.isArray(section.class)
			? [section.class]
			: section.class;
		const componentDefs = componentClasses.map(componentName => {
			const component = rmwc[componentName];

			return {
				name: componentName,
				component: component,
				propTypes: component.propTypes,
				defaultProps: component.defaultProps,
				propMeta: Object.entries(
					component.propMeta || {}
				).reduce((acc, [key, val]) => {
					acc[key] = {
						...val,
						type: !Array.isArray(val.type) ? [val.type] : val.type
					};
					return acc;
				}, {})
			};
		});

		const example = buildJSXWithContext(section.example, this, {
			...rmwc,
			...rmwcElements
		});
		const exampleCodePreview = cleanExampleCode(section.example);

		return (
			<Grid
				id={'detail-section-' + section.name.toLowerCase().replace(' ', '-')}
			>
				<GridCell span="12">
					<Typography use="display1" tag="h2">
						{section.name}
					</Typography>
					<Typography use="subheading2" tag="h3" wrap>
						<a href={section.url}>{section.url}</a>
					</Typography>
				</GridCell>

				<GridCell span="12">
					<div className="demo-example">
						<div className="demo-example-inner">{example}</div>

						<SyntaxHighlighter language="xml" style={codeStyle}>
							{exampleCodePreview}
						</SyntaxHighlighter>
					</div>
				</GridCell>

				<GridCell span="12">
					<Card>
						<List>
							{componentDefs.map((def, i) => (
								<ListGroup key={i}>
									<ListGroupSubheader>{def.name} Props</ListGroupSubheader>
									<table>
										<thead>
											<tr>
												<th>Prop</th>
												<th>Type</th>
												<th>Default</th>
												<th>Description</th>
											</tr>
										</thead>
										<tbody>
											{def.propTypes &&
												Object.keys(def.propTypes).map((propName, i) => (
													<tr key={i}>
														<td>{propName}</td>
														<td>
															{!!def.propMeta[propName] &&
																def.propMeta[propName].type.join(' | ')}
														</td>
														<td>{def.defaultProps[propName] + ''}</td>
														<td>
															{!!def.propMeta[propName] &&
																def.propMeta[propName].desc}
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</ListGroup>
							))}
						</List>
					</Card>
				</GridCell>
			</Grid>
		);
	}
}

export default Detail;