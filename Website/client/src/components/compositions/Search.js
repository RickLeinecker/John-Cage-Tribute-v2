import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import api from '../../utils/api';
import Spinner from '../layout/Spinner';
import CompList from "./CompList";

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: "",
			searchParam: "title",
			list: []
		};
		this.searchbarChange = this.searchbarChange.bind(this);
		this.performSearch = this.performSearch.bind(this);
		this.changeSearchParam = this.changeSearchParam.bind(this);
	}
	
	componentDidMount() {
		api.get("/compositions").then(r => {
			this.setState({list: r.data})
		})
	}
	
	render() {
		const s = "search-params-button";
		const chosenStyle = {
			backgroundColor: "#adf"
		}
		var res, tagsStyle=null, titleStyle=null, composerStyle=null, performerStyle=null; 
		switch(this.state.searchParam) {
			case "tags":
				tagsStyle = chosenStyle;
				break;
			case "composer":
				composerStyle = chosenStyle;
				break;
			case "performer":
				performerStyle = chosenStyle;
				break;
			case "title":
				titleStyle = chosenStyle;
				break;
		}
		return (
		<Fragment>
			<form style={{textAlign:"center"}} onSubmit={this.performSearch}>
				<input type="text" id="search-bar" placeholder="Search" 
					value={this.state.searchQuery} onChange={this.searchbarChange} />
				<input style={{padding:"8px 9px",fontWeight:"bold"}} 
					onClick={this.performSearch} type="submit" value=">"/>
			</form>
			<div style={{
				textAlign:"center",
				borderBottom:"2px solid #17a2b8",
				padding:"10px 0px"
			}}>
				<div className={s} id="title" style={titleStyle}
					onClick={() => this.changeSearchParam("title")}>Title</div>
				<div className={s} id="tags" style={tagsStyle}
					onClick={() => this.changeSearchParam("tags")}>Tags</div>
				<div className={s} id="composer" style={composerStyle}
					onClick={() => this.changeSearchParam("composer")}>Composer</div>
				<div className={s} id="performer" style={performerStyle}
					onClick={() => this.changeSearchParam("performer")}>Performer</div>
			</div>
			<div style={{padding:"10px"}}>
				<CompList list={this.state.list} dash={false} />
			</div>
		</Fragment>
		);
	}
	
	searchbarChange(e) {
		this.setState({searchQuery: e.target.value})
	}
	
	performSearch(e) {
		var query = this.state.searchQuery;
		var res = api.post("/compositions/"+this.state.searchParam, {query})
		res.then(r => {
			this.setState({list: r.data})
		})
		e.preventDefault();
	}
	
	changeSearchParam(str) {
		this.setState({
			searchParam: str
		})
	}
}

export default Search;