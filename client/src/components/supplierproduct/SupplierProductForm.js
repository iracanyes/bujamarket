/**
 * Author: iracanyes
 * Date: 22/09/2019
 * Description: Formulaire d'ajout de produits par un fournisseur
 */
import React, {Fragment} from 'react';
import {Link, Redirect, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import {
  Col,
  Row,
  Collapse
} from "reactstrap";
import { FormattedMessage, injectIntl } from "react-intl";
import { create, reset as resetCreate  } from "../../actions/supplierproduct/create";
import { update, reset as resetUpdate } from "../../actions/supplierproduct/update";
import { listByName, reset as resetCategories } from "../../actions/category/getNames";
import { getNames, reset as resetProducts } from '../../actions/product/getNames';
import PropTypes from 'prop-types';
import DropzoneWithPreviews from "../image/dropzone/DropzoneWithPreviews";
import { toastError } from "../../layout/component/ToastMessage";
import {SpinnerLoading} from "../../layout/component/Spinner";
import * as ISOCountryJson from "../../config/ISOCode/ISO3166-1Alpha2.json";
import * as _ from 'lodash';
import AutoCompleteProductNamesInput from "../product/AutoCompleteProductNamesInput";
import AutoCompleteCategoryNamesInput from "../category/AutoCompleteCategoryNamesInput";
import { Button } from '@material-ui/core';
import {
  IoIosCreate,
} from "react-icons/all";
import { RiFolderAddFill } from "react-icons/ri";

class SupplierProductForm extends React.Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    errorCreate: PropTypes.string,
    loadingCreate: PropTypes.bool,
    eventSourceCreate: PropTypes.instanceOf(EventSource),
    update: PropTypes.func.isRequired,
    listByName: PropTypes.func.isRequired,
    retrievedCategories: PropTypes.array,
    errorCategories: PropTypes.string,
    loadingCategories: PropTypes.bool,
    eventSourceCategories: PropTypes.instanceOf(EventSource),
    getNames: PropTypes.func.isRequired,
    retrievedProducts: PropTypes.object,
    errorProducts: PropTypes.string,
    loadingProducts: PropTypes.bool,
    eventSourceProducts: PropTypes.instanceOf(EventSource),
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      submitted: false,
      toggleProduct: 0,
      toggleCategory: false
    };

    this.auth = this.auth.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showNewProductForm = this.showNewProductForm.bind(this);
    this.showExistingProductForm = this.showExistingProductForm.bind(this);
    this.showProductCategoryForm = this.showProductCategoryForm.bind(this);
    this.showErrors = this.showErrors.bind(this);

    this.auth();
  }

  componentDidMount() {

    /* Récupération des catégories de produits */
    this.props.listByName();

    /* Récupération des noms de produits déjà existants */
    this.props.getNames();

  }

  componentWillUnmount() {
    this.props.resetCategories(this.props.eventSourceCategories);
    this.props.resetCreate(this.props.eventSourceCreate);
    this.props.resetProducts(this.props.eventSourceProducts);
    this.props.resetUpdate(this.props.eventSourceUpdate);
  }

  auth()
  {
    const user = localStorage.getItem("token") !== null
      ? JSON.parse(atob(localStorage.getItem("token").split('.')[1]))
      : {};

    if(user && user.roles && !user.roles.includes('ROLE_SUPPLIER'))
    {
      toastError("Vous n'êtes pas autorisé à publier du contenu sur la plateforme");
      this.props.history.push({ pathname: '../../'});
    }

    if(user === {})
    {
      this.props.history.push({ pathname: "../../login", state: { from : this.props.location.pathname }});
      toastError("Une authentification est nécessaire avant de publier un produit sur la plateforme.");
    }
  }

  handleSubmit(e)
  {
    e.preventDefault();
    this.setState({ submitted: true });

    // Récupération des données de formulaires
    const data = new FormData(document.getElementById('supplier-product-form'));

    // Ajout de l'id du produit
    //this.props.product && data.append("product[id]", this.props.product.product.id);

    // Ajout des images aux données du formulaire
    const images = document.getElementsByName('images')[0].files;

    const nbImages = (this.props.product && this.props.product.images) ? (this.props.product.images.length + images.length) : images.length;

    // Si plus de 10 images, on refuse l'envoi du formulaire
    if(nbImages > 10){
      toastError(`Maximum 10 images! (${images.length} images présentes)`);
      return;
    }

    for(let x= 0; x < images.length; x++)
      data.append("product[images]["+x+"]", images[x] );

    //const imageCategProduct = document.getElementsByName("product[category][image]")[0].files;
    //data.append("product[category][image]", imageCategProduct);

    //const imageCategNewProduct = document.getElementsByName("newProduct[category][image]")[0].files;
    //data.append("newProduct[category][image]", imageCategNewProduct);



    if(data !== null)
    {
      !this.props.product
        ? this.props.create(data, this.props.history, this.props.location)
        : this.props.update(this.props.product, data, this.props.history, this.props.location);
    }

  }

  showNewProductForm()
  {
    if(document.getElementById('new-product-form').classList.contains('d-none'))
    {
      /* Ré-initialisation du choix de catégorie */
      document.getElementById('existing-product-name-select').selectedIndex = 0;
      /* Désactivation du champ de sélection de catégorie de produit */
      document.getElementById('existing-product-name-select').setAttribute('disabled', 'disabled');
      /* Affichage du formulaire  */
      document.getElementById('new-product-form').classList.remove("d-none");
      if(!document.getElementById('existing-product-form').classList.contains('d-none'))
        document.getElementById('existing-product-form').classList.add('d-none');
    }else{
      /* Si le formulaire est affiché */
      // Activation du champ de sélection de la catégorie du produit
      document.getElementById('existing-product-name-select').removeAttribute('disabled');
      // Cacher le formulaire de proposition de catégorie
      document.getElementById('new-product-form').classList.add('d-none');
    }

  }

  showExistingProductForm()
  {
    if(document.getElementById('existing-product-form').classList.contains('d-none'))
    {
      /* Ré-initialisation du choix de catégorie */
      //document.getElementById('existing-product-name-select').value = "";
      /* Désactivation du champ de sélection de catégorie de produit */
      document.getElementById('existing-product-name-select').setAttribute('disabled', 'disabled');
      /* Affichage du formulaire  */
      document.getElementById('existing-product-form').classList.remove("d-none");

      if(!document.getElementById('new-product-form').classList.contains('d-none'))
        document.getElementById('new-product-form').classList.add('d-none');
    }else{
      /* Si le formulaire est affiché */
      // Activation du champ de sélection de la catégorie du produit
      document.getElementById('existing-product-name-select').removeAttribute('disabled');
      // Cacher le formulaire de proposition de catégorie
      document.getElementById('existing-product-form').classList.add('d-none');
    }

  }

  showProductCategoryForm(id)
  {
    const { toggleCategory } = this.state;
    /*
     * Si on ne clique pas pour la 2 fois sur le mm bouton , on affiche le formulaire et on desactive le bouton select,
     * Sinon, on n'affiche pas le formulaire et on active le bouton select
     */
    if(!((id === "1" && toggleCategory === "1" )|| (id=== "2" && toggleCategory === "2")))
    {
      /* Ré-initialisation du choix de catégorie */
      document.getElementById('product-category-select').selectedIndex = 0;
      /* Désactivation du champ de sélection de catégorie de produit */
      document.getElementById('product-category-select').setAttribute('disabled', 'disabled');

      /* Affichage du formulaire  */
      this.setState(state => ({
        ...state,
        toggleCategory: id
      }))

    }else{
      /* Si le formulaire est affiché */
      // Activation du champ de sélection de la catégorie du produit
      document.getElementById('product-category-select').removeAttribute('disabled');
      // Cacher le formulaire de proposition de catégorie
      /* Affichage du formulaire  */
      this.setState(state => ({
        ...state,
        toggleCategory: "0"
      }))

    }



  }

  showErrors()
  {
    const { errorCreate, errorProducts, errorCategories, updateError } = this.props;

    errorCreate && toastError(errorCreate);
    updateError && toastError(updateError);
    errorProducts && toastError(errorProducts);
    errorCategories && toastError(errorCategories);
  }

  renderField = data => {
    if(data.type !== "file")
    {
      data.input.className = 'form-control';
    }


    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`supplier_product_${data.input.name}`}
          className="form-control-label"
        >
          {data.labelText}
        </label>
        <input
          {...data.input}
          type={data.type}
          step={data.step}
          required={data.required}
          placeholder={data.placeholder}
          id={`supplier_product_${data.input.name}`}
        />
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  renderTextarea = data => {


    const isInvalid = data.meta.touched && !!data.meta.error;
    if (isInvalid) {
      data.input.className += ' is-invalid';
      data.input['aria-invalid'] = true;
    }

    if (this.props.error && data.meta.touched && !data.meta.error) {
      data.input.className += ' is-valid';
    }

    return (
      <div className={`form-group`}>
        <label
          htmlFor={`supplier_product_${data.input.name}`}
          className="form-control-label"
        >
          {data.labelText}
        </label>
        <textarea
          {...data.input}
          required={data.required}
          id={`supplier_product_${data.input.name}`}
          placeholder={data.placeholder}
        >
        </textarea>
        {isInvalid && <div className="invalid-feedback">{data.meta.error}</div>}
      </div>
    );
  };

  render() {
    const { intl, product, loadingCreate,  updateLoading  } = this.props;

    // Affichage des erreurs
    this.showErrors();

    // Redirection en cas de mise à jour du produit
    if (this.props.updated || this.props.created) {
      return (
        <Redirect
          to={`../../supplier_product/show/${encodeURIComponent(this.props.updated ? this.props.updated['id'] : this.props.created['id'] )}`}
        />
      );
    }


    return (
      <Fragment>
        <div className={"supplier-product-form my-3"}>
          <h5 className={'text-center mb-5'}>
            {!this.props.product
              ? <FormattedMessage  id={"app.page.supplier_product.title.add_product"}
                                   defaultMessage="Ajouter à un produit"
                                   description="Page Supplier product - Add form title"
                />
              : ""

            }
            { this.props.product && this.props.product.product.title}
          </h5>

          <form
            id="supplier-product-form"
            name="supplier-product"
            className={"col-lg-8 mx-auto px-3"}
            onSubmit={this.handleSubmit}
            //autoComplete={"on"}
          >
            <fieldset className={"mb-2"}>
              <legend>Information sur le produit</legend>
              <Row className={'mb-3'}>
                <Col className={'mb-3'}>
                  <label
                    htmlFor={'product[id]'}
                    className="form-control-label"
                  >
                    <FormattedMessage  id={"app.product.item.existingProducts"}
                                       defaultMessage="Produits existants"
                                       description="Product item - existing product"

                    />
                  </label>
                  &nbsp;:&nbsp;
                  {this.props.retrievedProducts  && (
                    <AutoCompleteProductNamesInput
                      name="product[id]"
                      id={"existing-product-name-select"}
                      label={intl.formatMessage({
                        id:"app.product.item.existingProducts",
                        defaultMessage:"Produits existants",
                        description:"Product item - existing product"
                      })}
                      //defaultValue={this.props.product ? { title: this.props.product.product.title, id: this.props.product.product.id} : null }
                      defaultValue={this.props.product && this.props.retrievedProducts['hydra:member'].find(el => el.title === this.props.product.product.title)}
                      data={this.props.retrievedProducts ? this.props.retrievedProducts['hydra:member'] : []}
                    />
                  )}

                </Col>
                <div className={'btn-actions d-flex flex-column align-items-center'}>
                  { this.props.product && (
                    <Button
                      variant={'contained'}
                      color={'primary'}
                      className={"mr-3 mb-3 text-success"}
                      startIcon={<IoIosCreate />}
                      onClick={() => this.showExistingProductForm()}
                    >
                      <FormattedMessage
                        id={"app.button.update_existing_product"}
                        defaultMessage={"Mise à jour du produit existant"}
                        description={'Product - update existing product'}
                      />
                    </Button>
                  )}
                  {this.props.retrievedProducts && (
                    <Button
                      variant={'contained'}
                      color={'primary'}
                      className={"mr-3"}
                      startIcon={<IoIosCreate />}
                      onClick={() => this.showNewProductForm()}
                    >
                      <FormattedMessage
                        id={"app.button.associate_with_new_product"}
                        defaultMessage={"Associer à un nouveau produit"}
                        description={'Product - associate with a new product'}
                      />
                    </Button>
                  )}


                </div>

              </Row>
              <div id="existing-product-form" className={"d-none"}>
                <h5>Modifier le produit</h5>
                <fieldset>
                  <legend>Infos publiés sur la plateforme</legend>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="product[title]"
                        type="text"
                        placeholder="Nom et modèle du produit"
                        labelText={intl.formatMessage({
                          id: "app.product.item.title",
                          defaultMessage: "Nom du produit",
                          description: "Product item - title"
                        })}

                      />
                    </Col>
                  </Row>
                  <Row className={'pt-3'}>
                    <Col>
                      <div className={'d-flex-row'}>
                        <label
                          htmlFor={'product[resume]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.product.item.resume"}
                                             defaultMessage="Description résumée"
                                             description="Product item - resume"
                          />
                        </label>
                        <Field
                          component={this.renderTextarea}
                          name="product[resume]"
                          className={'form-control w-100'}
                          defaultValue={"The cat was playing in the garden."}
                          normalize={(value) => _.truncate(value, {'length':  250, 'separator': ' ', 'omission': ' ...'})}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className={'pt-3'}>
                    <Col>
                      <div className={'d-flex-row'}>
                        <label
                          htmlFor={'product[description]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.product.item.description"}
                                             defaultMessage="Description"
                                             description="Product item - description"
                          />
                        </label>
                        <Field
                          component={this.renderTextarea}
                          name="product[description]"
                          className={'form-control w-100'}
                          placeholder={"The cat was playing in the garden."}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className={'mt-3'}>
                    <Col className={'col-8 mb-3'}>
                      <label
                        htmlFor={'product[countryOrigin]'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.product.item.country_origin"}
                                           defaultMessage="Origine du produit"
                                           description="Product item - country of origin"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      <Field
                        component={"select"}
                        name="product[countryOrigin]"
                        id={"product-country-origin-select"}
                        type="select"
                        className={'custom-select ml-2 col-2'}
                        style={{minWidth: "100%"}}
                      >
                        <option value="">--- Choisir parmi les pays d'orgine autorisés ---</option>
                        {
                          Object.entries(ISOCountryJson.default).map(([index, value]) => (
                            <option value={index.toUpperCase()} key={index}>
                              { value }
                            </option>
                          ))
                        }


                      </Field>
                    </Col>

                  </Row>
                </fieldset>

                <fieldset>
                  <legend>Dimension du produit</legend>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="product[weight]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.weight",
                          defaultMessage: "Poids",
                          description: "Product item - weight"
                        })}
                        value={0.0}
                        normalize={v => parseFloat(v)}
                      />
                      <Field
                        component={this.renderField}
                        name="product[length]"
                        type="number"
                        step="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.length",
                          defaultMessage: "Longueur",
                          description: "Product item - length"
                        })}
                        normalize={v => parseFloat(v)}
                      />
                    </Col>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="product[width]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.width",
                          defaultMessage: "Largeur",
                          description: "Product item - width"
                        })}
                        normalize={v => parseFloat(v)}
                      />
                      <Field
                        component={this.renderField}
                        name="product[height]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.height",
                          defaultMessage: "Hauteur",
                          description: "Product item - height"
                        })}
                        normalize={v => parseFloat(v)}
                      />

                    </Col>
                  </Row>
                </fieldset>

                <fieldset className={"mb-2"}>
                  <legend>Catégorie du produit</legend>
                  <Row>
                    <Col className={'mb-3'}>
                      <label
                        htmlFor={'product[category]'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.product.item.category"}
                                           defaultMessage="Catégorie du produit"
                                           description="Product item - category"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      {this.props.retrievedCategories && (
                        <AutoCompleteCategoryNamesInput
                          name="product[category][id]"
                          id={"product-category-select"}
                          label={intl.formatMessage({
                            id:"app.product.item.category",
                            defaultMessage:"Catégorie du produit",
                            description:"Product item - category"
                          })}
                          defaultValue={this.props.product ? { name: this.props.product.product.category.name, id: this.props.product.product.category.id} : null }
                          data={this.props.retrievedCategories ? this.props.retrievedCategories : []}
                        />
                      )}

                    </Col>
                    <Col className={'d-flex align-items-center'}>
                      <Button
                        variant={'outlined'}
                        color={'primary'}
                        startIcon={<RiFolderAddFill />}
                        onClick={() => this.showProductCategoryForm("1")}
                      >
                        Proposer une catégorie
                      </Button>
                    </Col>
                  </Row>
                  <Collapse isOpen={this.state.toggleCategory === "1"}>
                    <div id={"product-category-form"}>
                      <Row >
                        <Col>
                          <Field
                            component={this.renderField}
                            name="product[category][name]"
                            type="text"
                            placeholder="Nom de la catégorie"
                            labelText={intl.formatMessage({
                              id: "app.category.item.name",
                              defaultMessage: "Nom de la catégorie",
                              description: "Category item - name"
                            })}
                          />
                        </Col>

                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="product[category][description]">
                            <FormattedMessage id={"app.category.item.description"}
                                              defaultMessage={"Description de la catégorie"}
                                              description={"Category item - description"}
                            />
                          </label>
                          <Field
                            component={this.renderTextarea}
                            name="product[category][description]"
                            id="product-category-description"
                            placeholder={"Une brève description de la catégorie"}
                            className={'form-control'}
                          />
                        </Col>
                      </Row>
                      <Row className={'mt-3'}>
                        <Col>
                          <DropzoneWithPreviews
                            label={intl.formatMessage({
                              id: "app.category.item.image",
                              defaultMessage: "Image de la catégorie",
                              description: "Category item - image"
                            })}
                            inputName={'product[category][image]'}
                          />
                        </Col>
                      </Row>
                    </div>
                  </Collapse>


                </fieldset>

              </div>
              <div id="new-product-form" className={"d-none"}>
                <h5>Ajouter un nouveau produit</h5>
                <fieldset>
                  <legend>Infos publiés sur la plateforme</legend>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="newProduct[title]"
                        type="text"
                        placeholder="Nom et modèle du produit"
                        labelText={intl.formatMessage({
                          id: "app.product.item.title",
                          defaultMessage: "Nom du produit",
                          description: "Product item - title"
                        })}

                      />
                    </Col>
                  </Row>
                  <Row className={'pt-3'}>
                    <Col>
                      <div className={'d-flex-row'}>
                        <label
                          htmlFor={'newProduct[resume]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.product.item.resume"}
                                             defaultMessage="Description résumée"
                                             description="Product item - resume"
                          />
                        </label>
                        <Field
                          component={this.renderTextarea}
                          name="newProduct[resume]"
                          className={'form-control w-100'}
                          placeholder={"Make a short description of the product. (max: 255 characters)"}
                          normalize={(value) => _.truncate(value, {'length':  250, 'separator': ' ', 'omission': ' ...'})}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className={'pt-3'}>
                    <Col>
                      <div className={'d-flex-row'}>
                        <label
                          htmlFor={'newProduct[description]'}
                          className="form-control-label"
                        >
                          <FormattedMessage  id={"app.product.item.description"}
                                             defaultMessage="Description"
                                             description="Product item - description"
                          />
                        </label>
                        <Field
                          component={this.renderTextarea}
                          name="newProduct[description]"
                          className={'form-control w-100'}
                          placeholder={"Make a full description of the product"}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className={'mt-3'}>
                    <Col className={'col-8 mb-3'}>
                      <label
                        htmlFor={'newProduct[countryOrigin]'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.product.item.country_origin"}
                                           defaultMessage="Origine du produit"
                                           description="Product item - country of origin"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      <Field
                        component={"select"}
                        name="newProduct[countryOrigin]"
                        id={"product-country-origin-select"}
                        type="select"
                        className={'custom-select ml-2 col-2'}
                        style={{minWidth: "100%"}}
                      >
                        <option value="">--- Choisir parmi les pays d'orgine autorisés ---</option>
                        {
                          Object.entries(ISOCountryJson.default).map(([index, value]) => (
                            <option value={index.toUpperCase()} key={index}>
                              { value }
                            </option>
                          ))
                        }

                      </Field>
                    </Col>

                  </Row>
                </fieldset>

                <fieldset>
                  <legend>Dimension du produit</legend>
                  <Row>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="newProduct[weight]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.weight",
                          defaultMessage: "Poids",
                          description: "Product item - weight"
                        })}
                        value={0.0}
                        normalize={v => parseFloat(v)}
                      />
                      <Field
                        component={this.renderField}
                        name="newProduct[length]"
                        type="number"
                        step="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.length",
                          defaultMessage: "Longueur",
                          description: "Product item - length"
                        })}
                        normalize={v => parseFloat(v)}
                      />
                    </Col>
                    <Col>
                      <Field
                        component={this.renderField}
                        name="newProduct[width]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.width",
                          defaultMessage: "Largeur",
                          description: "Product item - width"
                        })}
                        normalize={v => parseFloat(v)}
                      />
                      <Field
                        component={this.renderField}
                        name="newProduct[height]"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="000.00"
                        labelText={intl.formatMessage({
                          id: "app.product.item.height",
                          defaultMessage: "Hauteur",
                          description: "Product item - height"
                        })}
                        normalize={v => parseFloat(v)}
                      />

                    </Col>
                  </Row>
                </fieldset>

                <fieldset className={"mb-2"}>
                  <legend>Catégorie du produit</legend>
                  <Row>
                    <Col className={'mb-3'}>
                      <label
                        htmlFor={'product[category]'}
                        className="form-control-label"
                      >
                        <FormattedMessage  id={"app.product.item.category"}
                                           defaultMessage="Catégorie du produit"
                                           description="Product item - category"

                        />
                      </label>
                      &nbsp;:&nbsp;
                      {this.props.retrievedCategories && (
                        <AutoCompleteCategoryNamesInput
                          name="newProduct[category][id]"
                          id={"newProduct[category][id]"}
                          label={intl.formatMessage({
                            id:"app.product.item.category",
                            defaultMessage:"Catégorie du produit",
                            description:"Product item - category"
                          })}
                          data={this.props.retrievedCategories ? this.props.retrievedCategories : []}
                        />
                      )}

                    </Col>
                    <Col className={'d-flex align-items-center'}>
                      <Button
                        variant={'contained'}
                        color={'primary'}
                        startIcon={<RiFolderAddFill />}
                        onClick={() => this.showProductCategoryForm("2")}
                      >
                        Proposer une catégorie
                      </Button>
                    </Col>
                  </Row>
                  {/*
                    <Row>
                        <Col className={'mb-3'}>
                          <label
                            htmlFor={'newProduct[category]'}
                            className="form-control-label"
                          >
                            <FormattedMessage  id={"app.product.item.category"}
                                               defaultMessage="Catégorie du produit"
                                               description="Product item - category"

                            />
                          </label>
                          &nbsp;:&nbsp;
                          <Field
                            component={"select"}
                            name="newProduct[category][id]"
                            id={"newProduct[category][id]"}
                            type="select"
                            className={'custom-select w-100 ml-2 col-2'}
                            style={{minWidth: "max-content"}}
                          >
                            <option value="">--- Choisir une catégorie de produit ---</option>
                            {this.props.retrievedCategories && this.props.retrievedCategories.map(item => (
                              <option value={item.id} key={item.id}>
                                { item.name }
                              </option>
                            ))}

                          </Field>
                        </Col>
                        <Col className={'d-flex align-items-center'}>
                          <Button
                            variant={'contained'}
                            color={'primary'}
                            startIcon={<RiFolderAddFill />}
                            onClick={() => this.showProductCategoryForm("2")}
                          >
                            Proposer une catégorie
                          </Button>
                        </Col>
                      </Row>
                  */}

                  <Collapse isOpen={this.state.toggleCategory === "2"}>
                    <div id={"product-category-form"}>
                      <Row >
                        <Col>
                          <Field
                            component={this.renderField}
                            name="newProduct[category][name]"
                            type="text"
                            placeholder="Nom de la catégorie"
                            labelText={intl.formatMessage({
                              id: "app.category.item.name",
                              defaultMessage: "Nom de la catégorie",
                              description: "Category item - name"
                            })}
                          />
                        </Col>

                      </Row>
                      <Row>
                        <Col>
                          <label htmlFor="newProduct[category][description]">
                            <FormattedMessage id={"app.category.item.description"}
                                              defaultMessage={"Description de la catégorie"}
                                              description={"Category item - description"}
                            />
                          </label>
                          <Field
                            component={this.renderTextarea}
                            name="newProduct[category][description]"
                            id="product-category-description"
                            placeholder={"Une brève description de la catégorie"}
                            className={'form-control'}
                          />
                        </Col>
                      </Row>
                      <Row className={'mt-3'}>
                        <Col>
                          <DropzoneWithPreviews label={"Image de la catégorie"} inputName={'newProduct[category][image]'}/>
                        </Col>
                      </Row>
                    </div>
                  </Collapse>


                </fieldset>

              </div>

            </fieldset>
            <fieldset>
              <legend>Images du produit</legend>
              <Row>
                {
                  product
                    ?  <DropzoneWithPreviews images={product.images} multiple={true}/>
                    :  <DropzoneWithPreviews multiple={true}/>
                }
              </Row>
            </fieldset>
            <fieldset className={"mb-2"}>
              <legend>Information de vente</legend>
              <Row>
                <Col>
                  <div className={`form-group d-flex`}>
                    <Field
                      component="input"
                      name="isAvailable"
                      type="checkbox"
                      className={'mx-2 '}
                      required={true}
                      id={`isAvailable`}
                    />
                    <label
                      htmlFor={`isAvailable`}
                      className="form-control-label ml-2 mb-0"
                    >
                      Produits disponible immédiatement (Requis)
                    </label>


                  </div>
                </Col>
                <Col>
                  <Field
                    component={this.renderField}
                    name="initialPrice"
                    type="number"
                    placeholder="00,00"
                    min={"0"}
                    step={"0.01"}
                    labelText={intl.formatMessage({
                      id: "app.supplier_product.item.initial_price",
                      defaultMessage: "Prix initial",
                      description: "Supplier product item - initial price"
                    })}
                  />
                </Col>
              </Row>
              <Row className={'pt-3'}>
                <Col>
                  <div className={`form-group d-flex`}>
                    <Field
                      component={"input"}
                      name="isLimited"
                      type="checkbox"
                      className={'mx-2'}
                      id={`isLimited`}
                    />
                    <label
                      htmlFor={`isLimited`}
                      className="form-control-label mb-0 ml-2"
                    >
                      Produits en quantité limité
                    </label>


                  </div>
                </Col>
                <Col>
                  <Field
                    component={this.renderField}
                    name="quantity"
                    type="number"
                    placeholder="0"
                    min="0"
                    step={"1"}
                    labelText={intl.formatMessage({
                      id: "app.quantity",
                      defaultMessage: "Quantité",
                      description: "Supplier product item - quantity"
                    })}
                    value={0}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    component={this.renderField}
                    name="additionalFee"
                    type="number"
                    step="1"
                    min="0"
                    max={"100"}
                    placeholder="21"
                    defaultValue={0}
                    required={true}
                    labelText={intl.formatMessage({
                      id: "app.supplier_product.item.additional_fee",
                      defaultMessage: "Taxes additionnels (en %)",
                      description: "Supplier product item - additional fee"
                    })}
                    normalize={v => parseFloat(v)}

                  />
                </Col>
                <Col>
                  <div className={'d-flex-row'}>
                    <label
                      htmlFor={'additionalInformation'}
                      className="form-control-label"
                    >
                      <FormattedMessage  id={"app.supplier_product.item.additional_information"}
                                         defaultMessage="Informations additionnelles"
                                         description="Supplier product item - additional information"
                      />
                    </label>
                    <Field
                      component={this.renderTextarea}
                      name="additionalInformation"
                      className={'form-control w-100'}
                      defaultValue={"Add all other useful information here."}
                    />
                  </div>
                </Col>
              </Row>
            </fieldset>
            {!this.props.product && (
              <Row className={"mb-2"}>
                <Col>
                  <div className={`form-group d-flex mt-2`}>
                    <input
                      name="termsAccepted"
                      type="checkbox"
                      className={'mx-2'}
                      style={{position: 'absolute', top: '0.25rem'}}
                      required={true}
                      id={`user_termsAccepted`}
                      value={true}
                    />
                    <label
                      htmlFor={`user_termsAccepted`}
                      className="form-control-label col-10 ml-5"
                    >
                      J'accepte les condition d'utilisation de la plateforme. <Link to={'/terms_condition'}>Voir termes et conditions</Link> <br/>
                      J'autorise l'exploitation de mes données personnelles fournis à cette plateforme dans les limites indiquées par les <Link to={'/rgpd'}>Utilisations des données personnelles</Link>
                    </label>


                  </div>
                </Col>
              </Row>
            )}
            <div>
              {loadingCreate && (
                <SpinnerLoading message={"Création du produit en cours..."} />
              )}
              { updateLoading && (
                <SpinnerLoading message={"Mise à jour du produit en cours..."} />
              )}
            </div>
            <Row>
              <div className="mx-auto">
                <button type="submit" name={'submit'} className="btn btn-success my-3 mx-2">
                  Envoyer
                </button>
                <Link to={".."} className={"btn btn-outline-danger my-3 mx-2"}>
                  Annuler
                </Link>
              </div>
            </Row>
          </form>
        </div>
      </Fragment>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { created, error: errorCreate, loading: loadingCreate, eventSource: eventSourceCreate } = state.supplierproduct.create;
  const { updated, updateError, updateLoading, eventSource: eventSourceUpdate } = state.supplierproduct.update;
  const { retrieved: retrievedCategories,error: errorCategories,loading: loadingCategories, eventSource: eventSourceCategories } = state.category.getNames;
  const { retrieved: retrievedProducts, error: errorProducts, loading: loadingProducts, eventSource: eventSourceProducts } = state.product.getNames;

  let product = null;
  if(ownProps.product)
  {
    product = {
      product:{
        id: ownProps.product.product.id,
        title: ownProps.product.product.title,
        resume: ownProps.product.product.resume,
        description: ownProps.product.product.description,
        length: ownProps.product.product.length,
        weight: ownProps.product.product.weight,
        width: ownProps.product.product.width,
        height: ownProps.product.product.height,
        countryOrigin: ownProps.product.product.countryOrigin,
        category: {
          id: ownProps.product.product.category.id,
          name: ownProps.product.product.category.name,
          description: ownProps.product.product.category.description,
          image: {
            id: ownProps.product.product.category.image.id,
            url: ownProps.product.product.category.image.url
          }
        }
      },
      initialPrice: ownProps.product.initialPrice,
      quantity: ownProps.product.quantity,
      isAvailable: ownProps.product.isAvailable,
      isLimited: ownProps.product.isLimited,
      additionalFee: ownProps.product.additionalFee * 100,
      additionalInformation: ownProps.product.additionalInformation,
      images: ownProps.product.images,
      category: ownProps.product.product.category.id,

    };
  }

  return {
    created,
    errorCreate,
    loadingCreate,
    eventSourceCreate,
    retrievedCategories,
    eventSourceCategories,
    errorCategories,
    loadingCategories,
    retrievedProducts,
    errorProducts,
    loadingProducts,
    eventSourceProducts,
    updated,
    updateError,
    updateLoading,
    eventSourceUpdate,
    initialValues: ownProps.product ? product : {}
  };
};

const mapDispatchToProps = dispatch => ({
  create: (supplierProduct, history, location ) => dispatch( create(supplierProduct, history, location)),
  update: (retrieved, supplierProduct, history, location) => dispatch(update(retrieved, supplierProduct, history, location)),
  listByName: () => dispatch(listByName()),
  getNames: () => dispatch(getNames()),
  resetCreate: eventSource => dispatch(resetCreate(eventSource)),
  resetCategories: eventSource => dispatch(resetCategories(eventSource)),
  resetUpdate: eventSource => dispatch(resetUpdate(eventSource)),
  resetProducts: eventSource => dispatch(resetProducts(eventSource))
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'supplier-product',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  })(injectIntl(withRouter(SupplierProductForm)))
)
