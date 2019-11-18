import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { underline } from 'ansi-colors';

export default class MenuList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            selectedCategoryIndex: 0,
            selectedSubCategoryIndex: 0,
            selectedSubCategoryName: "Test"
        }
    }

    componentDidMount() {
        return fetch('http://localhost:3001/api/menu')
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("response Json :::::::: " + responseJson.data.MenuGroups);
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.data.MenuGroups,
                    selectedSubCategoryName: responseJson.data.MenuGroups[0].categories[0].name
                }, function () {

                });

            })
            .catch((error) => {
                console.error(error);
            });
    }

    _onPressMainCategoryButton(item, index) {
        this.setState({
            selectedCategoryIndex: index,
            selectedSubCategoryIndex: 0
        })
    }

    _onPressSubCategoryButton(item, index) {
        this.setState({
            selectedSubCategoryIndex: index,
            selectedSubCategoryName: item.name
        })
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, padding: 20 }}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={{ flex: 1, paddingTop: 20 }}>
                <View style={{ paddingTop: 0, backgroundColor: 'rgba(65, 41, 115, 1.0)', height: 60 }}>
                    <FlatList
                        style={{ flex: 1 }}
                        horizontal={true}
                        data={this.state.dataSource}
                        renderItem={({ item, index }) => <TouchableOpacity onPress={() => this._onPressMainCategoryButton(item, index)}>
                            <View style={{ flex: 1 }}>
                            {index == this.state.selectedCategoryIndex ? <Text style={{flex: 1, color: 'white', padding: 10, fontWeight: 'bold', fontSize: 20, height: 60, textDecorationLine:'underline'}}>{item.name.toUpperCase()}</Text> : <Text style={styles.mainItem}>{item.name.toUpperCase()}</Text>}
                            </View>
                        </TouchableOpacity>}
                        keyExtractor={({ id }, index) => id}
                    />
                </View>
                <View style={{ paddingTop: 0, backgroundColor: 'rgba(46, 36, 85, 1.0)', height: 40 }}
                    ref={component => this.subCategoryView = component}>
                    <FlatList
                        style={{ flex: 1 }}
                        horizontal={true}
                        data={this.state.dataSource[this.state.selectedCategoryIndex].categories}
                        renderItem={({ item, index }) => <TouchableOpacity onPress={() => this._onPressSubCategoryButton(item, index)}>
                            <View style={{ flex: 1 }}>
                                {index == this.state.selectedSubCategoryIndex ? <Text style={styles.selectedSubCategoryItem}>{item.name}</Text> : <Text style={styles.subCategoryItem}>{item.name}</Text> }
                                                        </View>
                        </TouchableOpacity>}
                        keyExtractor={({ id }, index) => id}
                    />
                </View>
                <View style={{ flex: 1, paddingTop: 0, backgroundColor: 'rgba(252, 250, 253, 1.0)' }}>
                    <View style={{ paddingTop: 0, height: 40 }}>
                        <Text style={styles.sideHeadingLabel}>{this.state.selectedSubCategoryName}</Text>
                    </View>
                    <View style={{ flex: 1, paddingTop: 0 }}>
                        <FlatList
                            numColumns={2}
                            data={this.state.dataSource[this.state.selectedCategoryIndex].categories[this.state.selectedSubCategoryIndex].items}
                            renderItem={({ item }) => <View style={styles.contentViewStyle} >
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text style={{  color: 'black', padding: 10, fontWeight: 'bold', fontSize: 18 }}>{item.name}</Text>
                                    <Text style={{ marginLeft: 10 }} >{item.description}</Text>
                                    <Text style={{ marginLeft: 10 }} > Price: {item.price}</Text>
                                </View>
                                <View>
                                    <Image source={{ uri: 'https://via.placeholder.com/300.png?text='+item.name }}
                                        style={{ width: 100, height: 150, borderRadius: 5 }}
                                    />
                                </View>
                            </View>}
                            keyExtractor={({ id }, index) => id}
                        />
                    </View>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    mainItem: {
        flex: 1,
        color: 'white',
        padding: 10,
        fontWeight: 'bold',
        fontSize: 20,
        height: 60
    },
    subCategoryItem: {
        flex: 1,
        color: 'white',
        padding: 10,
        fontWeight: 'bold',
        fontSize: 18,
        height: 50
    },
    selectedSubCategoryItem: {
        flex: 1,
        color: 'white',
        padding: 10,
        fontWeight: 'bold',
        fontSize: 18,
        height: 50,
        textDecorationLine: 'underline'
    },
    sideHeadingLabel: {
        flex: 1,
        color: 'black',
        padding: 10,
        fontWeight: 'bold',
        fontSize: 18,
        height: 50
    },
    contentViewStyle: {
        flex: 0.333,
        backgroundColor: 'white',
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 5,
        height: 150,
        flexDirection: 'row'
    },
});